// LoginFailureMonitoringService.ts
import BaseMonitoringService from './BaseMonitoringService'
import { EachMessagePayload } from 'kafkajs'
import LoginFailureSummary from '../models/LoginFailureSummary'
import { LoginStatusType } from './enums'

class LoginFailureMonitoringService extends BaseMonitoringService {
	private failedLogins = 0
	private totalLogins = 0
	private static FAILURE_RATE_THRESHOLD = 10

	constructor(topic: string, dbConnectionString: string, kafkaBrokers: string[]) {
		super(topic, dbConnectionString, kafkaBrokers)
		setInterval(() => this.evaluateAndReset(), 60000)
	}

	protected async processMessage({ message }: EachMessagePayload): Promise<void> {
		if (!message.value) {
			return
		}

		const event = JSON.parse(message.value.toString())

		this.totalLogins++

		if (event.loginStatus === LoginStatusType.FAILED) {
			this.failedLogins++
		}

		console.log(`Total logins: ${this.totalLogins}, Failed logins: ${this.failedLogins}`)
	}

	private async evaluateAndReset() {
		const failureRate = this.totalLogins > 0 ? this.failedLogins / this.totalLogins : 0

		console.log('DEBUG', failureRate, LoginFailureMonitoringService.FAILURE_RATE_THRESHOLD)

		if (parseFloat((failureRate * 100).toFixed(2)) > LoginFailureMonitoringService.FAILURE_RATE_THRESHOLD) {
			console.log(`Alert: High login failure rate detected. Rate: ${(failureRate * 100).toFixed(2)}%`)
			this.sendAlert('slack', `High login failure rate detected. Rate: ${(failureRate * 100).toFixed(2)}%`)
		}

		// if (this.failedLogins > 0) {
		await new LoginFailureSummary({
			failedLogins: this.failedLogins,
			totalAttempts: this.totalLogins,
			failureRate: failureRate * 100,
		}).save()
		console.log(
			`Summary saved. Failed: ${this.failedLogins}, Total: ${this.totalLogins}, Rate: ${(failureRate * 100).toFixed(2)}%`
		)
		// }

		this.failedLogins = 0
		this.totalLogins = 0
	}
}

export default LoginFailureMonitoringService

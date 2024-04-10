// LoginFailureMonitoringService.ts
import BaseMonitoringService from './BaseMonitoringService'
import { EachMessagePayload } from 'kafkajs'
import LoginFailureSummary from '../models/LoginFailureSummary'

class LoginFailureMonitoringService extends BaseMonitoringService {
	private count = 0

	constructor(topic: string, dbConnectionString: string, kafkaBrokers: string[]) {
		super(topic, dbConnectionString, kafkaBrokers)
		setInterval(() => this.saveSummaryAndReset(), 60000)
	}

	protected async processMessage({ message }: EachMessagePayload) {
		this.count++
		console.log(`Processed login failure. Current count: ${this.count}`)
	}

	private async saveSummaryAndReset() {
		if (this.count > 0) {
			await new LoginFailureSummary({
				count: this.count,
			}).save()

			console.log(`Saved summary: ${this.count} login failures.`)
		} else {
			console.log('No login failures to record for the past minute.')
		}

		this.count = 0
	}
}

export default LoginFailureMonitoringService

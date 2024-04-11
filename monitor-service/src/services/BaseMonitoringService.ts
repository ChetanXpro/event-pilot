import mongoose from 'mongoose'
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs'
import axios, { AxiosError } from 'axios'
import config from '../config/config'

abstract class BaseMonitoringService {
	private kafka: Kafka
	protected consumer: Consumer
	private topic: string
	private dbConnectionString: string

	constructor(topic: string, dbConnectionString: string, kafkaBrokers: string[] = ['localhost:9092']) {
		this.kafka = new Kafka({ clientId: 'monitoring-service', brokers: kafkaBrokers })
		this.topic = topic
		this.dbConnectionString = dbConnectionString
		this.consumer = this.kafka.consumer({ groupId: `${topic}-group` })
	}

	async connect() {
		await mongoose.connect(this.dbConnectionString)
		console.log('Connected to MongoDB')
		await this.consumer.connect()
		await this.consumer.subscribe({ topic: this.topic, fromBeginning: true })

		await this.consumer.run({
			eachMessage: async (payload: EachMessagePayload) => {
				this.processMessage(payload)
			},
		})

		console.log(`Subscribed to ${this.topic} and started consuming...`)
	}

	protected abstract processMessage(payload: EachMessagePayload): void

	protected async sendAlert(via: string | string[], message: string): Promise<void> {
		if (typeof via === 'string') {
			via = [via] // Convert to array for uniform processing
		}

		for (const channel of via) {
			switch (channel.toLowerCase()) {
				case 'slack':
					this.sendSlackAlert(message)
					break
				case 'discord':
					this.sendDiscordAlert(message)
					break
				case 'all':
					this.sendSlackAlert(message)
					this.sendDiscordAlert(message)
					break

				default:
					console.warn(`Alerting channel '${channel}' is not supported.`)
			}
		}
	}

	private async sendSlackAlert(message: string) {
		const webhookUrl = config.slackWebhookUrl
		if (!webhookUrl) {
			console.error('SLACK_WEBHOOK_URL is required to send Slack alerts')
			return
		}

		try {
			const response = await axios.post(webhookUrl, {
				text: message,
			})

			console.log('Slack alert sent successfully:', response.data)
		} catch (error: AxiosError | any) {
			console.error('Error sending Slack alert:', error.response ? error.response.data : error.message)
		}
	}

	private sendDiscordAlert(message: string): void {
		// !TODO: Implement Discord alerting
		console.log(`Sending Discord alert: ${message}`)
	}
}

export default BaseMonitoringService

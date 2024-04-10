import mongoose from 'mongoose'
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs'

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
}

export default BaseMonitoringService

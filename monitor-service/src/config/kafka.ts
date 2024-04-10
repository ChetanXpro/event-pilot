import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
	clientId: 'monitoring-admin',
	brokers: ['localhost:9092'],
})

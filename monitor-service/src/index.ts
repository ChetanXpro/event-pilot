import dotenv from 'dotenv'
dotenv.config()

import LoginFailureMonitoringService from './services/LoginFailureMonitoringService'
import { KAFKA_TOPICS } from './constants/kafka-topics'

const kafkaBrokers = ['localhost:9092']

const startMonitoringServices = async () => {
	const MONGODB_URI = process.env.MONGODB_URI
	if (!MONGODB_URI) {
		throw new Error('MONGODB_URI is required')
	}
	const loginFailureService = new LoginFailureMonitoringService(KAFKA_TOPICS.LOGIN_FAILURE, MONGODB_URI, kafkaBrokers)

	await loginFailureService.connect()

	console.log('All monitoring services started successfully')
}

startMonitoringServices().catch(console.error)

// src/config/config.ts

interface Config {
	dbUri: string
	slackWebhookUrl: string
	kafkaBrokers: string[]
}

const environment = process.env.NODE_ENV || 'development'

const baseConfig: Config = {
	kafkaBrokers: ['localhost:9092'],
	dbUri: process.env.MONGODB_URI || '',
	slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
}

const developmentConfig: Config = {
	...baseConfig,
	dbUri: process.env.MONGODB_URI || '',
	slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
	kafkaBrokers: ['localhost:9092'],
}

const productionConfig: Config = {
	...baseConfig,
	dbUri: process.env.MONGODB_URI || '',
	slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
	kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
}

const config: { [env: string]: Config } = {
	development: developmentConfig,
	production: productionConfig,
}

export default config[environment]

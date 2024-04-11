// models/LoginFailureSummary.ts
import { Schema, model } from 'mongoose'

interface ILoginFailureSummary {
	timestamp: Date
	failedLogins: number
	totalAttempts: number
	failureRate: number
}

const schema = new Schema<ILoginFailureSummary>({
	timestamp: { type: Date, default: Date.now },
	failedLogins: { type: Number, required: true },
	totalAttempts: { type: Number, required: true },
	failureRate: { type: Number, required: true },
})

const LoginFailureSummary = model<ILoginFailureSummary>('LoginFailureSummary', schema)

export default LoginFailureSummary

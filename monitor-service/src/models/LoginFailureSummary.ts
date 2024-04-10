// models/LoginFailureSummary.ts
import { Schema, model } from 'mongoose'

interface ILoginFailureSummary {
	timestamp: Date
	count: number
}

const schema = new Schema<ILoginFailureSummary>({
	timestamp: { type: Date, default: Date.now },
	count: { type: Number, required: true },
})

const LoginFailureSummary = model<ILoginFailureSummary>('LoginFailureSummary', schema)

export default LoginFailureSummary

// server/config/db.js (o como lo tengas llamado)
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('🟢 MongoDB conectado')
  } catch (error) {
    console.error('🔴 Error al conectar a MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectDB

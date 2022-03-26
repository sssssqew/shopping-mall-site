import dotenv from 'dotenv'

dotenv.config() // process.env 객체에 환경변수 설정

export default {
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID
}


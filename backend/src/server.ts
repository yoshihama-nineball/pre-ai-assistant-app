import colors from 'colors'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import 'reflect-metadata'
import { db } from './config/db'
import analyzeRouter from './routes/analyzeRouter'

export async function connectDB() {
  try {
    await db.authenticate()
    db.sync()
    console.log(colors.blue.bold('MongoDBに接続しました'))
  } catch (error: any) {
    console.log(colors.red.bold(error.message))
  }
}
connectDB()

const app = express()

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      //TODO:  カスタムドメインがある場合ココに追加
    ],
    credentials: true,
  })
)

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/analyze', analyzeRouter)

app.get('/', (req, res) => {
  res.send('ユニットテストの動作確認')
})

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' })
})

export default app

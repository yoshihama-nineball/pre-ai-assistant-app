import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import morgan from 'morgan'

// 環境変数の読み込み
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ミドルウェア
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ルート
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Express.js + TypeScript Server is running!' })
})

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

export default app

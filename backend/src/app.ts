import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import resumeRoutes from './routes/resumes.js'
import templateRoutes from './routes/templates.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(cors({
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// 静态文件服务：仅允许图片类型访问，防止非图片文件被直接执行
app.use('/uploads', (req, res, next) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const ext = req.path.substring(req.path.lastIndexOf('.')).toLowerCase()
  if (!allowedExts.includes(ext)) {
    res.status(403).json({ error: '不允许访问该文件类型' })
    return
  }
  next()
}, express.static('uploads'))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ==================== 业务路由注册 ====================
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/templates', templateRoutes)

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app

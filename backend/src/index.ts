import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'

const app = new Hono()

// ✅ Allow frontend to send cookies to backend
app.use(
  '/*',
  cors({
    origin: ['http://localhost:5173', 'https://your-deployed-site.com'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // 🔥 Must be true for cookies
    exposeHeaders: ['Set-Cookie'], // 👈 Add this so browser can see cookies in response
  })
)

// ✅ Routes
app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app

import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signinInput, signupInput } from '@amityadav2005/medium-blog'

export const userRouter = new Hono()

// ---------- SIGNUP ----------
userRouter.post('/signup', async (c) => {
  const body = await c.req.json()
  const { success } = signupInput.safeParse(body)

  if (!success) {
    c.status(411)
    return c.json({ message: 'Inputs not correct' })
  }

  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    })

    //@ts-ignore
    const token = await sign({ id: user.id }, c.env.JWT_SECRET)

    // ✅ Automatically store JWT as cookie
    c.header(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Secure; SameSite=None; Max-Age=86400`
    )

    return c.json({ message: 'Signup successful' })
  } catch (e) {
    c.status(411)
    return c.text('Invalid')
  }
})

// ---------- SIGNIN ----------
userRouter.post('/signin', async (c) => {
  const body = await c.req.json()
  const { success } = signinInput.safeParse(body)

  if (!success) {
    c.status(411)
    return c.json({ message: 'Inputs not correct' })
  }

  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    })

    if (!user) {
      c.status(403)
      return c.json({ error: 'User not found' })
    }

    //@ts-ignore
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET)

    // ✅ Automatically store JWT as cookie
    c.header(
      'Set-Cookie',
      `token=${jwt}; HttpOnly; Path=/; Secure; SameSite=None; Max-Age=86400`
    )

    return c.json({ message: 'Signin successful' })
  } catch (e) {
    c.status(411)
    return c.json({ message: 'Invalid' })
  }
})

// ---------- SIGNOUT ----------
userRouter.post('/signout', async (c) => {
  // ✅ Clear JWT cookie by expiring it immediately
  c.header(
    'Set-Cookie',
    'token=; HttpOnly; Path=/; Secure; SameSite=None; Max-Age=0'
  )

  return c.json({ message: 'Signout successful' })
})

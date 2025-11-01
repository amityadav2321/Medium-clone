import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign, verify} from 'hono/jwt'
import { signinInput, signupInput, SignupInput } from '@amityadav2005/medium-blog'

export const userRouter = new Hono();

userRouter.post('/signup', async(c) => {

  const body = await c.req.json();
  const {success}=signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
        message:"Inputs not correct"
    })
  }
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  

  try{
    const user = await  prisma.user.create({
    data: {
      email:body.email,
      password: body.password,
      name:body.name
    },
  })

  //@ts-ignore
  const token = await sign({ id:user.id }, c.env.JWT_SECRET);
  return c.json({
    jwt:token
  })

  }catch(e){
  c.status(411);
  return c.text("Invalid")
  }

})


userRouter.post('/signin', async(c) => {
  const body = await c.req.json();
  const {success}=signinInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
        message:"Inputs not correct"
    })
  }
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  
try {
  const user = await  prisma.user.findUnique({
    where: {
      email:body.email,
      password: body.password,
    },
  });

  if(!user){
    c.status(403);
    return c.json({error: "user not found"});

  }

  //@ts-ignore
  const jwt =await sign({id:user.id},c.env.JWT_SECRET)
  return c.json({jwt});
} catch (e) {
  c.status(411);
  return c.json('Invalid');
}
  
})
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign, verify} from 'hono/jwt'
import { createBlogInput, updateBlogInput } from '@amityadav2005/medium-blog';

export const blogRouter = new Hono();

blogRouter.use('/*', async (c, next) => {
  try {
    // ✅ 1. First, check for token in cookies
    const cookieHeader = c.req.header('Cookie') || '';
    const token = cookieHeader
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      c.status(403);
      return c.json({ error: 'You are not login, Please Login!' });
    }

    // ✅ 2. Verify JWT
    // @ts-ignore
    const user = await verify(token, c.env.JWT_SECRET);

    if (user) {
      // @ts-ignore
      c.set('userId', user.id);
      await next();
    } else {
      c.status(403);
      return c.json({ error: 'Unauthorized' });
    }
  } catch (e) {
    c.status(403);
    return c.json({ error: 'You are not login, Please Login!' });
  }
});

blogRouter.post('/', async(c) => {
const body = await c.req.json();
const {success}=createBlogInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
        message:"Inputs not correct"
    })
  }
//@ts-ignore
const authorId =c.get("userId");
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());


  try{
    const blog = await prisma.post.create({
    data:{
        title:body.title,
        content:body.content,
        //@ts-ignore
        authorId: authorId
    }
  })
  return c.json({
    id:blog.id,
  })
 }catch(e){
    c.status(411);
    return c.json({
        error:"Something Wrong"
    })
 }
})

blogRouter.put('/', async(c) => {
  const body = await c.req.json();
  const {success}=updateBlogInput.safeParse(body);
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
    const blog = await prisma.post.update({
    where:{
        id:body.id
    },
    data:{
        title:body.title,
        content:body.content,
       
    }
  })
  return c.json({
    id:blog.id,
  })
 }catch(e){
    c.status(411);
    return c.json({
        error:"Something Wrong"
    })
 }
})

blogRouter.get('/bulk', async(c) => { 
  

  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());


  const blogs = await prisma.post.findMany();
  return c.json({
    blogs
  })
})

blogRouter.get('/:id', async(c) => {
  const id =  c.req.param("id");

  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());


  try{
    const blog = await prisma.post.findFirst({
    where: {
        id:id
    }
    
  })
  return c.json({
    blog
  })
}catch(e){
c.status(411);
return c.json({
    error:"Something Wrong"
})
}
})


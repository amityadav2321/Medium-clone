import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign, verify} from 'hono/jwt'
import { createBlogInput, updateBlogInput } from '@amityadav2005/medium-blog';

export const blogRouter = new Hono();

blogRouter.use('/*',async (c,next)=>{

  //get the header 
  //verify the header 
  // if the header is correct ,we need can proceed
  //if not ,we return the uer the 403 status code
  try {
    const authHeader= c.req.header("Authorization") || "";

  const token= authHeader.split(" ")[1];

  //@ts-ignore
  const user= await verify(token,c.env.JWT_SECRET);

  if(user){
    //@ts-ignore
    c.set("userId", user.id);
    await next();
  }
  else{
    c.status(403)
    return c.json({error:"unauthorized"})
  }
 }catch(e){
    c.status(403);
    return c.json({
        error:"You are not login, Please Login!"
    })
 }
})

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


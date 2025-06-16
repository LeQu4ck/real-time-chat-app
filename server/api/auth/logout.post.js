import { setCookie } from 'h3'

export default defineEventHandler((event) => {
  setCookie(event, 'token', '', {
    path: '/',        
    maxAge: 0,        
    httpOnly: true,   
  })

  return { success: true }
})

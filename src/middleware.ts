import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from "next-auth/middleware"
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({req: request})
  console.log(token);
  const url = request.nextUrl;
  if(token && (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/register') ||
      url.pathname.startsWith('/verify')
  ))
  return NextResponse.redirect(new URL('/', request.url));

  if(token?.role !== 'admin' && (
      url.pathname.startsWith('/post-newsletter') ||
      url.pathname.startsWith('/delete-newsletters') ||
      url.pathname.startsWith('/dashboard')
  ))
  return NextResponse.redirect(new URL('/forbidden', request.url));

}
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/dashboard',
    '/post-newsletter',
    '/delete-newsletters'
  ]
}
import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/sign-up' || path === '/';

  const token = request.cookies.get('token')?.value || '';
  console.log("toker", token);

  /* if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  } */
}

export const config = {
  matcher: ['/((?!api/auth|api/~|_next/static|_next/image|.*\\.png$).*)'],
}

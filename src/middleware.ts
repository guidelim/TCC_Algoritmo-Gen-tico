import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  let token = request.cookies.has('token')

  if(token === false) { 
    const host = request.headers.get('host');
    const loginURL = new URL('/login', 'https://smarthub.systempe.com.br');

    return NextResponse.redirect(loginURL.toString());
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // '/app/:path*'
  ]
};
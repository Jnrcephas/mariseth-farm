import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl?.pathname;
    const token = req.nextauth.token
    if (!token?.access_token && pathname.includes("/app")) {
      // Redirect to login if token is not present
      return NextResponse.redirect(new URL('/', req.url))
  }

    // if logged in redirect to admin
    return NextResponse.next();
  },
  {
    secret: process.env.SECRET,
    callbacks: {
      authorized: (params) => {
        const { token } = params;
        return !!token;
      },
    },
  },
);

export const config = {
  // matcher: '/((?!api|static|.*\\..*|_next).*)',
  matcher: ["/app/:path*"],
};

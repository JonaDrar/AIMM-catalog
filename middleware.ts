import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // La lógica de autorización vive en el callback `authorized`.
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLogin = req.nextUrl.pathname === "/admin/login";
        if (isLogin) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};

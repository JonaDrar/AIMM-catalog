declare module "next-auth" {
  export type NextAuthOptions = import("next-auth/core/types").AuthOptions;

  interface Session {
    user?: {
      id?: string;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
  }
}

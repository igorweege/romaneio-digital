// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'USER';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: 'ADMIN' | 'USER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: 'ADMIN' | 'USER';
  }
}
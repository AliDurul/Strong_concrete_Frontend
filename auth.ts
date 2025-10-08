import NextAuth, { Account, Profile, Session } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { userInfo } from "@/types/next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "@auth/core/providers/credentials";
import { fetchWithErrorHandling, refreshAccessToken, registerOrFetchUser } from "./lib/features/auth/authActions";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

class SignInError extends Error {
  constructor(message: string, public code: string = "signin_error") {
    super(message);
    this.name = "SignInError";
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {
        if (!credentials) return null;
        const { email, password } = credentials as any;
        return fetchWithErrorHandling(`${BASE_URL}/auth/login`, { email, password });
      },

      // async authorize(credentials) {
      //   if (!credentials) return null;
      //   const { email, password } = credentials as any;

      //   const res = await fetch(`${BASE_URL}/auth/login`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ email, password }),
      //   });

      //   const user = await res.json();
      //   if (res.ok && user) {
      //     return user;
      //   } else {
      //     throw new Error(user.message || "Authentication failed");
      //   }
      // },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user) return false;

      try {
        if (account?.provider !== 'credentials') {
          const userTokens = await registerOrFetchUser(account as Account, profile as Profile);
          user.access = userTokens.access;
          user.refresh = userTokens.refresh;
        }
      } catch (error) {
        if (error instanceof SignInError) return `/auth-error?error=${encodeURIComponent(error.message)}&code=${error.code}`;

        return `/auth-error?error=An unexpected error occurred`;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {

      if (trigger === 'update' && session?.user) Object.assign(token.userInfo, session.user);

      if (user) return { ...token, access: user.access, refresh: user.refresh, userInfo: jwtDecode<userInfo>(user.access) };

      if (Date.now() < token.userInfo.exp * 1000) return token;

      if (!token.refresh) throw new TypeError("Missing refresh_token");

      const res = await refreshAccessToken(token);

      return res;
    },

    // async jwt({ token, user }) {
    //   if (user) {
    //     token.access = user?.access;
    //     token.refresh = user?.refresh;
    //     token.expiresAt = Math.floor(Date.now() / 1000 + 60 * 60 * 24);
    //     token.userInfo = jwtDecode<userInfo>(user?.access);
    //     return token;
    //   } else if (Date.now() < token?.expiresAt * 1000) {
    //     return token;
    //   } else {
    //     try {
    //       const res = await fetch(`${BASE_URL}/auth/refresh`, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ refresh: token.refresh }),
    //       });
    //       const tokens = await res.json();

    //       if (!res.ok) throw tokens;

    //       token.access = tokens?.access;
    //       token.expiresAt = Math.floor(Date.now() / 1000 + 60 * 60 * 24);

    //       return token;
    //     } catch (error) {
    //       console.error("Error refreshing access token", error);
    //       return { ...token, error: "RefreshAccessTokenError" as const };
    //     }
    //   }
    // },

    // @ts-ignore
    // async session({ session, token }) {
    //   const { userInfo, refresh, access, error } = token;
    //   session.user = userInfo;
    //   session.accessToken = access;
    //   session.refreshToken = refresh;
    //   session.error = error;
    //   return session;
    // },

     async session({ session, token }) {
      if (token.access) {
        const { access, refresh, userInfo, error } = token as JWT;
        session.user = userInfo as any;
        session.accessToken = access;
        session.refreshToken = refresh;
        session.error = error;
      }
      return session as Session;
    },
  },
  pages: { signIn: "/login", signOut: "/" },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
});

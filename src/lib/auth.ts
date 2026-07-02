import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

import axios from "axios";
import { API_BASEURL } from "./constants";
import { UserWithToken } from "@/apis/adminApiSchemas";
import { getErrorMap } from "./helpers";

declare module "next-auth" {
  interface Session {
    user: UserWithToken;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the login screen
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try{
        const { data } = await axios.post(
          `${API_BASEURL}/accounts/auth/login`,
          credentials,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (data) {
          return data;
        }else{
          return null;
        }}
         catch (error: any) {
          const errorMessage =  error.status === 500 ? "Login Failed" : getErrorMap(error.response?.data)
          throw new Error(errorMessage);
        }   
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      return { ...token, ...user } as any;
    },
    session: async ({ session, token }: { session: any; token: any }) => {
      session.user = { ...token };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  session: {
    strategy: 'jwt', // Use JWT for sessions
  },
  pages: {
    signIn: '/', // Customize your login page
  },
};


export const getAuthSession = async () => {
  return getServerSession(authOptions);
};

export async function fetchUserGroupsApi(): Promise<any> {
  const res = await axios.get("/api/user/groups");
  return res.data;
}


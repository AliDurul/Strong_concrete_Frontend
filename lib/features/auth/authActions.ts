"use server";
import { signIn } from "@/auth";
import { userInfo } from "@/types/next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/utils/routes";
import { jwtDecode } from "jwt-decode";
import { Account, AuthError, CredentialsSignin, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { redirect } from "next/navigation";
import { credentialsSchema } from "./zod";


interface loginValuesType {
  email: string;
  password: string;
}
interface resetPasswordValuesType {
  uid: string | null
  emailToken: string | null;
  password: string | null;
  password2: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL;

export const login = async (values: loginValuesType) => {
  const { email, password } = values;

  try {

    await signIn("credentials", {
      email,
      password,
    });


  } catch (error: any) {
    let errorMsg = '';
    let success = false;
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // user is already logged in and redirected
      success = true;
      return {
        success,
        message: errorMsg || 'Something went wrong.',
      }
    } else if (error instanceof AuthError) {
      errorMsg = error.message;
    } else {
      errorMsg = (error as any).message;
    }

    return {
      success,
      message: errorMsg || 'Something went wrong.',
    }


  }
};


export const verifyEmail = async (emailToken: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/auth/verify-email?emailToken=${emailToken}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: "Something went wrong ! Try again" };
    }
    throw error;
  }
};

export const forgetPassword = async (email: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/forget-password`, {
      cache: "no-store",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    } else {
      return data;
    }
  } catch (error: any) {
    return { error: error.message };
  }
};
export const resetPassword = async (values: resetPasswordValuesType) => {
  const { uid, emailToken, password, password2 } = values;
  try {
    const res = await fetch(
      `${BASE_URL}/users/reset-password/${uid}/${emailToken}`,
      {
        cache: "no-store",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, password2 }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    } else {
      return data;
    }
  } catch (error: any) {
    return { error: error.message };
  }
};


export const fetchWithErrorHandling = async (url: string, body: object) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok || data.isError) throw new CustomError(data.message || 'Custom Message: Authentication failed');
    return data;
  } catch (error) {
    throw new CustomError(error instanceof Error ? error.message : 'Network or server error occurred');
  }
};

export const registerOrFetchUser = async (account: Account, profile: Profile) => {
  let payload;
  switch (account.provider) {
    case 'google':
      const { sub, email, name, picture } = profile;
      payload = { email, sub, fullname: name, picture };
      break;
    case 'github':
      const { node_id, email: ghEmail, name: ghName, avatar_url, html_url, bio } = profile;
      payload = { email: ghEmail, sub: node_id, fullname: ghName, picture: avatar_url, github_link: html_url, bio };
      break;
    default:
      throw new SignInError('Unsupported provider', 'unsupported_provider');
  }

  return fetchWithErrorHandling(`${BASE_URL}/auth/register`, payload);
};

export const refreshAccessToken = async (token: JWT) => {
  try {
    const newTokens = await fetchWithErrorHandling(`${BASE_URL}/auth/refresh`, { refresh: token.refresh });
    return {
      ...token,
      access: newTokens.access,
      userInfo: jwtDecode<userInfo>(newTokens.access),
      refresh: newTokens.refresh || token.refresh,
    };
  } catch (error: unknown) {
    return { ...token, error: "RefreshTokenError" };
  }
};


// Custom Errors
class CustomError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.message = message || "Custom Message: Authentication failed";
  }
  code = "custom_error";
}

class SignInError extends Error {
  constructor(message: string, public code: string = "signin_error") {
    super(message);
    this.name = "SignInError";
  }
}
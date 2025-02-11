"use server";

import { cookies } from "next/headers";

export async function setCookie(name: string, value: string, options = {}) {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    path: "/", // set the path where the cookie is valid
    httpOnly: true, // accessible only via HTTP requests
    secure: true, // ensure the cookie is sent over HTTPS only
    sameSite: "strict", // set SameSite policy (can be 'strict', 'lax', or 'none')
    maxAge: 60 * 60 * 24, // set cookie expiration time (in seconds)
    ...options, // additional options
  });
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value || null;
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.set(name, "", {
    path: "/",
    maxAge: 0, // set maxAge to 0 to delete the cookie
  });
}

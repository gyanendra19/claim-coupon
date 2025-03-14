'use server'

import { cookies } from "next/headers";

export async function checkCookies() {
  const allCookies = cookies(); // Get all cookies
  const myCookie = (await allCookies).get("coupon_claimed"); // Get a specific cookie

  return myCookie ? myCookie.value : "No cookie found.";
}
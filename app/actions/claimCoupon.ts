"use server";

import { cookies } from "next/headers";
import { supabaseClient } from "./credentials";
import { headers } from "next/headers";

export async function checkCookies() {
  const allCookies = cookies(); // Get all cookies
  const myCookie = (await allCookies).get("coupon_claimed"); // Get a specific cookie

  console.log("All Cookies:", allCookies);
  console.log("My Cookie:", myCookie);

  return myCookie ? myCookie.value : "No cookie found.";
}


export async function claimCoupon() {
  try {
    const supabase = await supabaseClient();

    // Get user's IP address
    const forwardedFor = (await headers()).get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "UNKNOWN";

    console.log(forwardedFor, ip, 'ip');
    
    if (ip === "UNKNOWN") {
      return { success: false, message: "Could not detect IP address." };
    }

    // Check if user has claimed within the last hour
    const { data: existingClaims, error: claimError } = await supabase
      .from("claims")
      .select("*")
      .eq("ip_address", ip)
      .gte("claimed_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

      console.log(existingClaims, 'claims');
      
    if (claimError) throw new Error(claimError.message);

    if (existingClaims.length > 0) {
      return { success: false, message: "You have already claimed a coupon. Try again in 1 hour." };
    }

    // 🔄 Step 2: Get the last assigned coupon
    const { data: existingState, error: stateCheckError  } = await supabase
      .from("global_coupon_state")
      .select("last_assigned_coupon_id")

      console.log(existingState, 'global');
      
    if (stateCheckError ) throw new Error(stateCheckError .message);

    if (existingState.length === 0) {
      // Insert default row if none exists
      const { error: insertStateError } = await supabase
        .from("global_coupon_state")
        .insert([{id: 1, last_assigned_coupon_id: 0 }]);

      if (insertStateError) throw new Error(insertStateError.message);
    }

    const { data: globalState, error: stateError } = await supabase
    .from("global_coupon_state")
    .select("last_assigned_coupon_id")
    .limit(1); // Use limit instead of `.single()`


    if (stateError) throw new Error(stateError.message);

    const lastCouponId = globalState[0]?.last_assigned_coupon_id || 0;

    // 🎟 Step 3: Get the next available coupon in order
    const { data: nextCouponRow, error: couponError } = await supabase
      .from("coupons")
      .select("id, code")
      .gt("id", lastCouponId)
      .order("id", { ascending: true })
      .limit(1);

    console.log(nextCouponRow, 'row');
    
    let nextCoupon;

    if (couponError) throw new Error(couponError.message);

    if (nextCouponRow.length === 0) {
      // If no more coupons after the last assigned one, loop back to the first
      const { data: firstCouponRow, error: firstCouponError } = await supabase
        .from("coupons")
        .select("id, code")
        .order("id", { ascending: true })
        .limit(1);

      if (firstCouponError) throw new Error(firstCouponError.message);
      if (firstCouponRow.length === 0) {
        return { success: false, message: "No more coupons available." };
      }
      nextCoupon = firstCouponRow[0];
    } else {
      nextCoupon = nextCouponRow[0];
    }

    // 🔄 Step 4: Update global state with the new last assigned coupon
    const { error: updateError } = await supabase
      .from("global_coupon_state")
      .update({ last_assigned_coupon_id: nextCoupon.id })
      .eq("id", 1);

    if (updateError) throw new Error(updateError.message);

    // 📝 Step 5: Save the claim in the database
    const { error: insertError } = await supabase
      .from("claims")
      .insert({ ip_address: ip, coupon_code: nextCoupon.code });

    if (insertError) throw new Error(insertError.message);

    // 🍪 Step 6: Set a cookie to prevent unnecessary requests
    (await cookies()).set({
      name: "coupon_claimed",
      value: "true",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    return { success: true, message: "Coupon claimed successfully!", coupon: nextCoupon.code };
  } catch (error) {
    console.error("Error claiming coupon:", error);
    return { success: false, message: "Something went wrong. Please try again later." };
  }
}

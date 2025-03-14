"use client";
import { useState } from "react";
import { claimCoupon } from "./actions/claimCoupon";
import { checkCookies } from "./actions/checkCookies";
import { timeLeftToClaim } from "./utils/TimeLeft";

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const claimCouponCode = async () => {
    setLoading(true);
    try {
      const res = await checkCookies();
      const timeLeft = timeLeftToClaim(Number(res));

      // Check cookies for faster response
      if (res !== "No cookie found.") {
        setMessage(
          `Coupon already claimed.Try in ${Math.floor(
            timeLeft / 60 / 1000
          )} minutes`
        );
        setLoading(false);
        return;
      }
      const response = await claimCoupon();
      setMessage(response.message);
      setCoupon(response.coupon || null);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
        <h1 className="text-2xl font-bold mb-4">Claim Your Coupon</h1>

        {coupon ? (
          <p className="text-green-600 font-semibold">
            🎉 Your Coupon: {coupon}
          </p>
        ) : (
          <button
            onClick={claimCouponCode}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Claiming..." : "Claim Coupon"}
          </button>
        )}

        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}

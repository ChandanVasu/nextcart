import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, currency } = await request.json();

    const razorpay = new Razorpay({
      key_id: process.env.RZP_KEY,
      key_secret: process.env.RZP_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency,
      receipt: `rcp_${Date.now()}`,
    };

    console.log("Razorpay Order Options:", amount);

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ orderId: order.id, amount: order.amount }, { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

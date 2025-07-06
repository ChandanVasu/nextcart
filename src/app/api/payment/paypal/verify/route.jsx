import { NextResponse } from "next/server";

const PAYPAL_API = process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

// Get PayPal Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    // Get order details
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const order = await res.json();

    // Optional: auto-capture the payment if not already captured
    if (order.status === "APPROVED") {
      const captureRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const captureData = await captureRes.json();

      if (captureRes.ok && captureData.status === "COMPLETED") {
        const customId = captureData?.purchase_units?.[0]?.custom_id || null;

        return NextResponse.json({
          success: true,
          message: "Payment captured successfully",
          status: captureData.status,
          custom_id: customId,
          // data: captureData,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Capture failed",
          // data: captureData,
        });
      }
    }

    // If payment is already completed
    if (order.status === "COMPLETED") {
      const customId = order?.purchase_units?.[0]?.custom_id || null;

      return NextResponse.json({
        success: true,
        message: "Payment already completed",
        status: order.status,
        custom_id: customId,
        // data: order,
      });
    }

    // For all other statuses
    return NextResponse.json({
      success: false,
      message: `Order is not completed: ${order.status}`,
      status: order.status,
      data: order,
    });
  } catch (error) {
    console.error("PayPal Verify Error:", error);
    return NextResponse.json({ error: "Verification failed", details: error.message }, { status: 500 });
  }
}

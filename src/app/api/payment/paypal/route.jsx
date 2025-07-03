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

// Create Order API
export async function POST(request) {
  try {
    const { amount, currency, customer } = await request.json();

    if (!amount || !currency || !customer?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "Your Store",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        },
      }),
    });

    const data = await response.json();

    // ✅ Add guard: ensure links are present
    if (!Array.isArray(data.links)) {
      return NextResponse.json(
        {
          error: "PayPal response invalid",
          details: data,
        },
        { status: 500 }
      );
    }

    const approvalLink = data.links.find((link) => link.rel === "approve");

    if (!approvalLink) {
      return NextResponse.json(
        {
          error: "No approval link returned from PayPal",
          details: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id, approvalUrl: approvalLink.href });
  } catch (error) {
    console.error("PayPal Error:", error.message || error);
    return NextResponse.json(
      {
        error: "PayPal order creation failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

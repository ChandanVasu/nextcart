export const dynamic = "force-dynamic";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.STOREFRONT_ACCESS_TOKEN;

async function fetchMenuByHandle(handle = "main-menu") {
  const query = `
    query {
      menu(handle: "${handle}") {
        id
        title
        items {
          title
          type
          url
          items {
            title
            type
            url
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  const menu = json?.data?.menu;

  if (!menu) {
    return null;
  }

  return menu;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle") || "main-menu";

  try {
    const menu = await fetchMenuByHandle(handle);

    if (!menu) {
      return new Response(JSON.stringify({ error: "Menu not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(menu), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch menu:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch menu" }), { status: 500 });
  }
}

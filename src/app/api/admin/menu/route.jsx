const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}/admin/api/2025-04/graphql.json`;

async function GET() {
  try {
    const query = `
      query getShopMetafield($namespace: String!, $key: String!) {
        shop {
          metafield(namespace: $namespace, key: $key) {
            id
            value
            type
          }
        }
      }
    `;

    const variables = {
      namespace: "shopead_menu",
      key: "menu",
    };

    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Shopify API error" }), { status: res.status });
    }

    const json = await res.json();

    if (json.errors) {
      return new Response(JSON.stringify({ error: "GraphQL errors", details: json.errors }), { status: 500 });
    }

    const metafield = json.data.shop.metafield;
    let value = [];

    if (metafield && metafield.value) {
      try {
        const parsed = JSON.parse(metafield.value);
        value = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        value = [];
      }
    }

    return new Response(JSON.stringify(value), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: err.message }), { status: 500 });
  }
}

async function POST(req) {
  try {
    const newMenu = await req.json();

    if (!newMenu.name) {
      return new Response(JSON.stringify({ error: "Menu name is required" }), { status: 400 });
    }

    // Fetch existing metafield to get id and value
    const query = `
      query getShopMetafield($namespace: String!, $key: String!) {
        shop {
          metafield(namespace: $namespace, key: $key) {
            id
            value
          }
        }
      }
    `;

    const variables = {
      namespace: "shopead_menu",
      key: "menu",
    };

    const fetchRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!fetchRes.ok) {
      return new Response(JSON.stringify({ error: "Shopify API error" }), { status: fetchRes.status });
    }

    const fetchJson = await fetchRes.json();

    if (fetchJson.errors) {
      return new Response(JSON.stringify({ error: "GraphQL errors", details: fetchJson.errors }), { status: 500 });
    }

    const existingMetafield = fetchJson.data.shop.metafield;

    let menus = [];
    if (existingMetafield && existingMetafield.value) {
      try {
        const parsed = JSON.parse(existingMetafield.value);
        menus = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        menus = [];
      }
    }

    // Add or update the menu in the array
    const index = menus.findIndex((menu) => menu.name === newMenu.name);
    if (index >= 0) {
      menus[index] = newMenu;
    } else {
      menus.push(newMenu);
    }

    const valueString = JSON.stringify(menus);

    // Upsert metafield mutation
    const mutation = `
      mutation metafieldUpsert($input: MetafieldInput!) {
        metafieldUpsert(input: $input) {
          metafield {
            id
            namespace
            key
            value
            type
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      namespace: "shopead_menu",
      key: "menu",
      type: "json",
      value: valueString,
    };

    if (existingMetafield && existingMetafield.id) {
      input.id = existingMetafield.id;
    }

    const saveRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables: { input } }),
    });

    if (!saveRes.ok) {
      return new Response(JSON.stringify({ error: "Shopify API error" }), { status: saveRes.status });
    }

    const saveJson = await saveRes.json();

    if (saveJson.errors || (saveJson.data.metafieldUpsert.userErrors && saveJson.data.metafieldUpsert.userErrors.length > 0)) {
      return new Response(
        JSON.stringify({
          error: "Metafield upsert errors",
          details: saveJson.errors || saveJson.data.metafieldUpsert.userErrors,
        }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ success: true, metafield: saveJson.data.metafieldUpsert.metafield }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: err.message }), { status: 500 });
  }
}

export { GET, POST };

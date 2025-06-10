// This file handles CRUD operations for Shopify metafields using GraphQL.
// It supports GET, POST, PUT, and DELETE methods.

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}/admin/api/2025-04/graphql.json`;

async function fetchMetafield(namespace, key) {
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

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables: { namespace, key } }),
  });

  const json = await res.json();
  return json.data?.shop?.metafield || null;
}

// === GET ===
async function GET(req) {
  const { searchParams } = new URL(req.url);
  const namespace = searchParams.get("namespace");
  const key = searchParams.get("key");

  if (!namespace || !key) {
    return new Response(JSON.stringify({ error: "Missing namespace or key" }), { status: 400 });
  }

  const metafield = await fetchMetafield(namespace, key);

  let value = null;
  if (metafield?.value) {
    try {
      value = JSON.parse(metafield.value);
    } catch {
      value = metafield.value;
    }
  }

  return new Response(JSON.stringify({ metafield, value }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// === POST === (Create or Upsert)
async function POST(req) {
  const { namespace, key, value } = await req.json();

  if (!namespace || !key || value === undefined) {
    return new Response(JSON.stringify({ error: "Missing namespace, key, or value" }), { status: 400 });
  }

  const existing = await fetchMetafield(namespace, key);

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
    namespace,
    key,
    type: "json",
    value: JSON.stringify(value),
  };

  if (existing?.id) input.id = existing.id;

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: mutation, variables: { input } }),
  });

  const json = await res.json();
  const errors = json.data?.metafieldUpsert?.userErrors;

  if (json.errors || (errors && errors.length)) {
    return new Response(JSON.stringify({ error: "Upsert failed", details: errors || json.errors }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true, metafield: json.data.metafieldUpsert.metafield }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// === PUT === (Update only if exists)
async function PUT(req) {
  const { namespace, key, value } = await req.json();

  if (!namespace || !key || value === undefined) {
    return new Response(JSON.stringify({ error: "Missing namespace, key, or value" }), { status: 400 });
  }

  const existing = await fetchMetafield(namespace, key);

  if (!existing?.id) {
    return new Response(JSON.stringify({ error: "Metafield does not exist" }), { status: 404 });
  }

  return POST(req); // Delegate to POST since upsert supports updating by ID
}

// === DELETE ===
async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const body = await req.json().catch(() => ({}));
  const namespace = body.namespace || searchParams.get("namespace");
  const key = body.key || searchParams.get("key");

  if (!namespace || !key) {
    return new Response(JSON.stringify({ error: "Missing namespace or key" }), { status: 400 });
  }

  const metafield = await fetchMetafield(namespace, key);

  if (!metafield?.id) {
    return new Response(JSON.stringify({ error: "Metafield not found" }), { status: 404 });
  }

  const mutation = `
    mutation metafieldDelete($id: ID!) {
      metafieldDelete(input: { id: $id }) {
        deletedId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: mutation, variables: { id: metafield.id } }),
  });

  const json = await res.json();
  const errors = json.data?.metafieldDelete?.userErrors;

  if (json.errors || (errors && errors.length)) {
    return new Response(JSON.stringify({ error: "Delete failed", details: errors || json.errors }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true, deletedId: json.data.metafieldDelete.deletedId }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export { GET, POST, PUT, DELETE };

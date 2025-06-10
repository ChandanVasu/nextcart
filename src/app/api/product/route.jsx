export const dynamic = "force-dynamic";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.STOREFRONT_ACCESS_TOKEN;

function flattenEdges(edges = []) {
  return edges.map((edge) => edge.node);
}

function transformProduct(product) {
  return {
    ...product,
    variants: flattenEdges(product.variants?.edges),
    images: flattenEdges(product.images?.edges),
  };
}

async function fetchAllProducts() {
  let products = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const query = `
      {
        products(first: 100${endCursor ? `, after: "${endCursor}"` : ""}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            cursor
            node {
              id
              title
              handle
              description
              vendor
              productType
              tags
              availableForSale
              createdAt
              updatedAt
              options {
                name
                values
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                    availableForSale
                    quantityAvailable
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              images(first: 5) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    const data = json?.data?.products;

    if (!data) break;

    const newProducts = data.edges.map((edge) => transformProduct(edge.node));
    products.push(...newProducts);

    hasNextPage = data.pageInfo.hasNextPage;
    endCursor = data.pageInfo.endCursor;
  }

  return products;
}

export async function GET() {
  try {
    const products = await fetchAllProducts();
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    });
  }
}

export const dynamic = "force-dynamic";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = process.env.STOREFRONT_ACCESS_TOKEN;

function flattenEdges(edges = []) {
  return edges.map((edge) => edge.node);
}

function transformCollection(collection) {
  return {
    ...collection,
    products: flattenEdges(collection.products?.edges).map((product) => ({
      ...product,
      variants: flattenEdges(product.variants?.edges),
      images: flattenEdges(product.images?.edges),
    })),
  };
}

async function fetchAllCollections() {
  let collections = [];
  let hasNextPage = true;
  let endCursor = null;

  while (hasNextPage) {
    const query = `
      {
        collections(first: 100${endCursor ? `, after: "${endCursor}"` : ""}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              image {
                src
                altText
              }
              products(first: 10) {
                edges {
                  node {
                    id
                    title
                    handle
                    vendor
                    availableForSale
                    images(first: 1) {
                      edges {
                        node {
                          src
                          altText
                        }
                      }
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          id
                          title
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
    const data = json?.data?.collections;

    if (!data) break;

    const newCollections = data.edges.map((edge) => transformCollection(edge.node));
    collections.push(...newCollections);

    hasNextPage = data.pageInfo.hasNextPage;
    endCursor = data.pageInfo.endCursor;
  }

  return collections;
}

export async function GET() {
  try {
    const collections = await fetchAllCollections();
    return new Response(JSON.stringify(collections), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch collections" }), {
      status: 500,
    });
  }
}

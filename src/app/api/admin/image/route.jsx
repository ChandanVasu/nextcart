const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const GRAPHQL_URL = `https://${SHOPIFY_DOMAIN}/admin/api/2025-04/graphql.json`;

// === GET: Fetch all files with pagination ===
export async function GET() {
  try {
    let hasNextPage = true;
    let after = null;
    const allFiles = [];

    while (hasNextPage) {
      const query = `
        query getFiles($first: Int!, $after: String) {
          files(first: $first, after: $after) {
            edges {
              node {
                id
                createdAt
                alt
                preview {
                  image {
                    url
                  }
                }
              }
              cursor
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `;

      const variables = { first: 50, after };

      const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
      });

      const json = await res.json();

      if (json.errors) {
        return new Response(JSON.stringify({ error: "GraphQL errors", details: json.errors }), { status: 500 });
      }

      const edges = json.data.files.edges;
      allFiles.push(...edges.map((edge) => edge.node));

      hasNextPage = json.data.files.pageInfo.hasNextPage;
      after = hasNextPage ? edges[edges.length - 1].cursor : null;
    }

    // 🌟 Simplify the response to only relevant fields
    const simplified = allFiles.map((file) => ({
      id: file.id,
      createdAt: file.createdAt,
      alt: file.alt || "",
      image: file.preview?.image?.url || null,
    }));

    return new Response(JSON.stringify(simplified), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: err.message }), { status: 500 });
  }
}

// === POST: Upload file and re-fetch to ensure preview image ===
export async function POST(request) {
  try {
    const { originalSource, alt, contentType } = await request.json();

    const mutation = `
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            id
            createdAt
            alt
            preview {
              image {
                url
              }
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `;

    const variables = {
      files: [
        {
          originalSource,
          alt,
          contentType,
        },
      ],
    };

    const uploadRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const uploadJson = await uploadRes.json();

    if (uploadJson.errors || uploadJson.data?.fileCreate?.userErrors?.length > 0) {
      return new Response(
        JSON.stringify({
          error: "GraphQL upload errors",
          details: uploadJson.errors || uploadJson.data.fileCreate.userErrors,
        }),
        { status: 500 }
      );
    }

    const uploadedFile = uploadJson.data.fileCreate.files[0];
    const fileId = uploadedFile.id;

    // Wait 2 seconds to allow Shopify to generate the preview image
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Re-fetch file by ID to check if preview is now available
    const refetchQuery = `
      query getFile($id: ID!) {
        node(id: $id) {
          ... on GenericFile {
            id
            createdAt
            alt
            preview {
              image {
                url
              }
            }
          }
          ... on MediaImage {
            id
            createdAt
            alt
            preview {
              image {
                url
              }
            }
          }
        }
      }
    `;

    const refetchRes = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: refetchQuery, variables: { id: fileId } }),
    });

    const refetchJson = await refetchRes.json();

    if (refetchJson.errors) {
      return new Response(JSON.stringify({ error: "Refetch error", details: refetchJson.errors }), { status: 500 });
    }

    return new Response(JSON.stringify(refetchJson.data.node), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: err.message }), { status: 500 });
  }
}

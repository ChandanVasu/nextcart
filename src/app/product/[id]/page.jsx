import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Product from "./product";

export default async function Page({ params }) {
  const { id } = params;

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/product/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const data = await res.json();
  return <Product data={data} />;
}

// ✅ Add this to dynamically generate metadata
export async function generateMetadata({ params }) {
  const { id } = params;

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/product/${id}`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
    };
  }

  const data = await res.json();
  const product = data;

  return {
    title: product.title,
    description: product.shortDescription || product.description?.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.shortDescription || product.description,
      images: product.images?.map((img) => img.url) || [],
    },
  };
}

import { notFound } from "next/navigation";
import Product from "./product";
import getDomainName from "@/lib/getServerDomainName";

export default async function Page(props) {
  const { params } = props;
  const { id } = await params;

  const domainName = await getDomainName();

  const res = await fetch(`${domainName}/api/product/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const data = await res.json();
  return <Product data={data} />;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const { id } = params;

  const domainName = await getDomainName();

  const res = await fetch(`${domainName}/api/product/${id}`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for doesn't exist.",
    };
  }

  const product = await res.json();

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

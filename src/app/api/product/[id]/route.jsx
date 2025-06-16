import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({}, { timestamps: true, versionKey: false, strict: false });

if (mongoose.models.Products) delete mongoose.models.Products;
const Product = mongoose.model("Products", ProductSchema);

// ✅ GET: Fetch product by ID
export async function GET(_, { params }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  } catch (error) {
    console.error("GET by ID error:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// /app/api/admin/image/route.js
import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  }
);

if (mongoose.models.Images) {
  delete mongoose.models.Images;
}

const Image = mongoose.model("Images", ImageSchema);

export async function GET() {
  await dbConnect();
  const images = await Image.find({});
  return Response.json(images);
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const image = await Image.create(body);
    return Response.json(image, { status: 201 });
  } catch (error) {
    console.error("Image POST Error:", error);
    return Response.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) return Response.json({ error: "_id is required" }, { status: 400 });

    const updatedImage = await Image.findByIdAndUpdate(_id, updateData, { new: true });
    if (!updatedImage) return Response.json({ error: "Image not found" }, { status: 404 });

    return Response.json(updatedImage);
  } catch (error) {
    console.error("Image PUT Error:", error);
    return Response.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id } = body;

    if (!_id) return Response.json({ error: "_id is required" }, { status: 400 });

    const deletedImage = await Image.findByIdAndDelete(_id);
    if (!deletedImage) return Response.json({ error: "Image not found" }, { status: 404 });

    return Response.json({ message: "Image deleted", _id });
  } catch (error) {
    console.error("Image DELETE Error:", error);
    return Response.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

import dbConnect from "@/lib/dbConnection";
import mongoose from "mongoose";

// ✅ Schema with _id as String to allow 'singleton'
const schema = new mongoose.Schema(
  {
    _id: { type: String },
  },
  {
    timestamps: true,
    strict: false,
    versionKey: false,
  }
);

const MODEL_NAME = "store-settings";

// Prevent model overwrite error during hot reloads
if (mongoose.models[MODEL_NAME]) {
  delete mongoose.models[MODEL_NAME];
}

const StoreModel = mongoose.model(MODEL_NAME, schema, MODEL_NAME);

// POST = replace the single stored settings object
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const _id = "singleton"; // internal consistent ID
    const data = { ...body, _id };

    const updated = await StoreModel.findByIdAndUpdate(
      _id,
      data,
      { upsert: true, new: true }
    );

    return Response.json({ message: "Saved", data: updated });
  } catch (err) {
    console.error("Settings save error:", err.message, err.stack);
    return Response.json({ error: err.message || "Failed to save settings" }, { status: 500 });
  }
}

// GET = fetch the single stored settings object
export async function GET() {
  try {
    await dbConnect();
    const existing = await StoreModel.findById("singleton");
    return Response.json(existing || {});
  } catch (err) {
    console.error("Settings fetch error:", err.message);
    return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

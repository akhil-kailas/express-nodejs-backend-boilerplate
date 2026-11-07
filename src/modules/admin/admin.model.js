import mongoose from "mongoose";

// Admin is config-based (no User document), so refresh tokens are kept here.
const adminSessionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    refreshTokenHash: { type: String, required: true },
  },
  { timestamps: true },
);

const AdminSession =
  mongoose.models.AdminSession ||
  mongoose.model("AdminSession", adminSessionSchema);

export default AdminSession;

import { verifyAccessToken } from "../utils/jwt.js";

export const authenticateUser = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token required" });
    }

    const decoded = verifyAccessToken(token, "user");
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ success: false, message });
  }
};
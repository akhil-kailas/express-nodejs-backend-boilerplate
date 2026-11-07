import { verifyAccessToken } from "../utils/jwt.js";

const extractToken = (req) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme === "Bearer" && token ? token : null;
};

const buildAuthMiddleware = (role, onSuccess) => (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization token required" });
    }

    const decoded = verifyAccessToken(token, role);
    onSuccess(req, decoded);
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ success: false, message });
  }
};

export const authenticateUser = buildAuthMiddleware("user", (req, decoded) => {
  req.user = { id: decoded.id };
});

export const authenticateAdmin = buildAuthMiddleware(
  "admin",
  (req, decoded) => {
    req.admin = { email: decoded.email };
  },
);

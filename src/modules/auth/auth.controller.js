/**
 * Auth health check
 */
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    module: "auth",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
};

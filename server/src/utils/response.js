export const successResponse = (res, status, data = null) => {
  return res.status(status).json({
    success: true,
    message: "Request success",
    ...(data !== null && { data }),
  });
};

export const errorResponse = (res, message, status, error) => {
  return res.status(status).json({
    success: false,
    message,
    error
  });
};

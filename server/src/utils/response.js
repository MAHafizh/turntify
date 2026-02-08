export const successResponse = (res, message, status, data = null) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data !== null && { data }),
  });
};

export const errorResponse = (res, message, status) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
export const successResponse = (res, message, data = null, status) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, errors = null, status) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

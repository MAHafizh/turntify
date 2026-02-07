export const successResponse = (res, message, status, data = null,) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, status, errors = null,) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

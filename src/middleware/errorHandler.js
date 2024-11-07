export const errorHandler = (err, req, res, next) => {
  const { status, message } = err
  res.status(status || 500).json({
    error: {
      message: message || 'Error occurred',
      status: status || 500
    }
  })
}

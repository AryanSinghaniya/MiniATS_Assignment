/**
 * asyncHandler - wraps an async route handler and forwards any errors
 * to Express's next() so we don't need try/catch in every controller.
 *
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

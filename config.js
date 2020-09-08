const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.JWT_KEYS = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

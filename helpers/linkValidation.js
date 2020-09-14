const validator = require('validator');
const LinkError = require('../errors/LinkError');

const linkValidator = (link) => {
  if (!validator.isURL(link)) {
    throw new LinkError('link is not valid');
  }
  return link;
};

module.exports = linkValidator;

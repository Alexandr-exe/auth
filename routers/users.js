const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUsers, findUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), findUser);

module.exports = router;

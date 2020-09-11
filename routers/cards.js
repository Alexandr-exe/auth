const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const linkValidator = require('../helpers/linkValidation');
const { getCard, deleteCard, createCard } = require('../controllers/cards');

router.get('/', getCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(linkValidator).required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), deleteCard);

module.exports = router;

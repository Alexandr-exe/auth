const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbbienError = require('../errors/ForbbienError');

const getCard = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (cards) {
        res.send({ cards });
        return;
      }
      throw new NotFoundError('Карточек нет');
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate('owner')
    .orFail((error) => error)
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        throw new ForbbienError('доступ запрещён');
      }
      return card.remove()
        .then(() => {
          res.send({ delete: card });
        });
    })
    .catch(next);
};

module.exports = { getCard, createCard, deleteCard };

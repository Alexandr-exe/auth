const { Error } = require('mongoose');
const Card = require('../models/card');

const getCard = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      if (cards) {
        res.send({ cards });
        return;
      }
      res.status(404).send({ message: 'Карточек нет' });
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Запрос неверно сформирован' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail((err) => err)
    .populate('owner')
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new Error(403, 'Access denied');
      }
      return card.remove()
        .then(() => {
          res.send({ delete: card });
        });
    })
    .catch((err) => {
      if (err instanceof TypeError) {
        res.status(403).send({ message: 'Нет прав на удаление' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = { getCard, createCard, deleteCard };

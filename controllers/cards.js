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
    .populate('owner')
    .orFail((error) => error)
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        return res.status(403).send({ message: 'доступ запрещён' });
      }
      return card.remove()
        .then(() => {
          res.send({ delete: card });
        });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Cart empty' });
      }
      if (error.name === 'DocumentNotFoundError') {
        return res.status(500).send({ message: 'Карта уже удалена или ещё не создана' });
      }
      return res.status(500).send({ message: 'Проблемы сервера' });
    });
};

module.exports = { getCard, createCard, deleteCard };

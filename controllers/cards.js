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
    .then((card) => {
      if (card) {
        if (req.user._id === card.owner._id) {
          card.remove();
          res.send({ data: card });
          console.log(card.owner._id);
          console.log(req.user._id);
          return;
        }
        res.status(403).send({ message: 'У вас нет прав для удаления этой карточки' });
      }
      res.status(404).send({ message: 'Нет такой карточки' });
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = { getCard, createCard, deleteCard };

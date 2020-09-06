const router = require('express').Router();
const { getCard, deleteCard, createCard } = require('../controllers/cards');

router.get('/', getCard);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);

module.exports = router;

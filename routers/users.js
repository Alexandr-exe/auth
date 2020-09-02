const router = require('express').Router();
const { getUsers, findUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', findUser);

module.exports = router;

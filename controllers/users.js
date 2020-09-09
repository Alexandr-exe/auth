const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const EmptyError = require('../errors/EmptyError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users) {
        res.send({ users });
        return;
      }
      throw new NotFoundError('Пользователи отсутствуют');
    })
    .catch((err) => next(err));
};

const findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail((err) => {
      if (err.name === 'CastError') {
        throw new EmptyError('User empty');
      }
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Пользователь не найдён');
      }
    })
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const regexp = /[\W]+/i;
  if (!password || regexp.test(password)) {
    throw new EmptyError('Пароль либо пуст, либо содержит не верное значение');
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
    }))

    .then((user) => {
      res.status(201).send({
        id: user._id,
        email: user.email,
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        'sdf',
        { expiresIn: '7d' });
      res.send({
        token,
      });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  findUser,
  createUser,
  login,
};

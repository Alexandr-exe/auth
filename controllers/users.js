const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users) {
        res.send({ users });
        return;
      }
      res.status(404).send({ message: 'Пользователи отсутствуют' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      id: user._id,
      email: user.email,
    }))
    .catch((err) => res.status(400).send(err));
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' });
      res.send({
        token,
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  findUser,
  createUser,
  login,
};

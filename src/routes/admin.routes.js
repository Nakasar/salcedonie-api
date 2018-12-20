const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');

const { BadRequestError } = require('../errors');

const {requireAdminRights} = require('../middlewares/authentication.middleware');

const User = require('../models/user.model');

const router = express.Router();

router.use(requireAdminRights);

/**
 * @swagger
 *
 * components:
 *  schemas:
 *    UserCreate:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *        discord_id:
 *          type: string
 *      example:
 *        username: Nakasar
 *        discord_id: 11119836820
 *    User:
 *      allOf:
 *        - $ref: '#/components/schemas/UserCreate'
 *        - type: object
 *          properties:
 *            id:
 *              type: string
 *          example:
 *            id: dazda9763
 *
 */

/**
 * @swagger
 *
 * /users:
 *  get:
 *    operationId: getUsers
 *    summary: Get existing users
 *    description: Get existing users summaries.
 *    responses:
 *      200:
 *        description: List of users.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 *
 */
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll({}, 'id username discord_id');

    return res.json(users);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 *
 * /users:
 *  post:
 *    operationId: createUser
 *    summary: Create a user
 *    description: Create a user
 *    requestBody:
 *      description: User to create
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserCreate'
 *    responses:
 *      201:
 *        description: User created (see id in Location header)
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 */
router.post('/users', async (req, res, next) => {
  try {
    const { username, discord_id, password } = req.body;

    const result = Joi.validate({ username, discord_id, password }, Joi.object().keys({
      username: Joi.string().alphanum().min(3).max(50).required(),
      discord_id: Joi.string().regex(/^[0-9]{11}$/).required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/),
    }));

    if (result.error) {
      throw new BadRequestError('body should be { username: alphanum{3-50}, discord_id: [valid discord ID], password: [a-zA-Z0-9]{8,30}')
    }

    let hash;
    try {
      hash = await bcrypt.hash(password, 8);
    } catch (err) {
      console.error('Could not hash password: ', JSON.stringify(err));

      throw new BadRequestError('Password is not valid.');
    }

    const user = new User({ username, discord_id, password: hash });

    const savedUser = await user.save();

    return res.json(savedUser);
  } catch (err) {
    return next(err);
  }
});

router.patch('/users/:userId', async (req, res, next) => {
  try {

  } catch (err) {
    return next(err);
  }
});


module.exports = router;
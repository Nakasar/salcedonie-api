const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');

const { BadRequestError, ResourceNotFoundError } = require('../errors');

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
 *            id: '5c1c06cd8d93224570fcc65b'
 *  securitySchemes:
 *    admin:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  parameters:
 *    userId:
 *      name: userId
 *      in: path
 *      required: true
 *      description: ID of user
 *      schema:
 *        type: string
 *        example: '5c1c06cd8d93224570fcc65b'
 */

/**
 * @swagger
 *
 * /users:
 *  get:
 *    operationId: getUsers
 *    summary: Get existing users
 *    description: Get existing users summaries.
 *    security:
 *      - admin: []
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
    const users = await User.find({}, 'id username discord_id');

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
 *    security:
 *      - admin: []
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
    await user.save();

    const createdUser = user.findOne({ username }, 'id username discord_id');

    return res.json(createdUser);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 *
 * /users/{userId}:
 *  post:
 *    operationId: updateUser
 *    summary: Update a user
 *    description: Update a user
 *    security:
 *      - admin: []
 *    parameters:
 *      - $ref: '#/components/parameters/userId'
 *    requestBody:
 *      description: Fields to update
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/UserCreate'
 *    responses:
 *      204:
 *        description: User updated
 */
router.post('/users/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { username, discord_id, password } = req.body;

    const result = Joi.validate({ username, discord_id, password }, Joi.object().keys({
      username: Joi.string().alphanum().min(3).max(50),
      discord_id: Joi.string().regex(/^[0-9]{11}$/),
      password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/),
    }));

    let user;
    try {
      user = await User.findById(userId);
    } catch(err) {
      throw new BadRequestError('userID in path parameters is not a valid ID.');
    }

    if (!user) {
      throw new ResourceNotFoundError('The user does not exist.', 'USER_NOT_FOUND');
    }

    if (username) {
      user.username = username;
    }
    if (discord_id) {
      user.discord_id = discord_id;
    }
    if (password) {
      try {
        user.password = await bcrypt.hash(password, 8);
      } catch (err) {
        console.error('Could not hash password: ', JSON.stringify(err));

        throw new BadRequestError('Password is not valid.');
      }
    }

    try {
      await user.save();
    } catch (err) {
      throw new BadRequestError('Check unity constraints.');
    }

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
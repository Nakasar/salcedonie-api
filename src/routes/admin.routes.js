const express = require('express');

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



    return res.json(user);
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
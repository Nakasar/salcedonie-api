const bcrypt = require('bcrypt');
const cors = require('cors');
const express = require('express');

const { BadRequestError } = require('./errors');

const { authenticate } = require('./middlewares/authentication.middleware');

const adminRouter = require('./routes/admin.routes');

const User = require('./models/user.model');

const TokenService = require('./services/token.service');

function init(config) {
  const app = express();

  const mongoose = require('mongoose');
  mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });

  app.use(express.json({ urlextended: true }));
  app.use(cors());

  /**
   * @swagger
   *
   * /auth:
   *  post:
   *    operationId: auth
   *    summary: Auth endpoint to generate a token.
   *    description: Authenticate against username and password to retrieve an access token.
   *    requestBody:
   *      description: User credentials
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *              password:
   *                type: string
   *            required:
   *              - username
   *              - password
   *            example:
   *              username: John Smith
   *              password: Jo0hnPAs0rdN0tS3cur3
   *    responses:
   *      200:
   *        description: User access token.
   *        content:
   *          application/json:
   *            schema:
   *              type: string
   *
   */
  app.post('/auth', async (req, res, next) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new BadRequestError('body should contain { username: string, password: string }.', 'NO_CREDENTIALS');
      }

      const user = await User.findOne({ username });

      if (!user) {
        throw new BadRequestError('No user found for this username.', 'NO_USER_FOUND');
      }

      if (!await bcrypt.compare(password, user.password)) {
        throw new BadRequestError('Incorrect password.', 'WRONG_PASSWORD');
      }

      const token = await TokenService.sign({
        is_admin: user.username === 'nakasar',
        user_id: user.id,
      });

      return res.json(token);
    } catch(err) {
      return next(err);
    }
  });

  app.use(authenticate);

  app.use(adminRouter);

  app.get('/actions', (req, res) => {
    const actions = [{ id: 'On973jdn987', character, date, hour, event: 'ode09a198dn', message }];

    return res.json(actions);
  });

  app.post('/actions', (req, res) => {
    const { character, date, hour, event, message } = req.body;

    const action = { id: 'On973jdn987', character, date, hour, event: 'ode09a198dn', message };

    res.set('Location', action.id);

    return res.sendStatus(201);
  });

  app.delete('/actions/:actionId', (req, res) => {
    return res.sendStatus(204);
  });

  app.get('/actions/:actionId', (req, res) => {
    const action = { id: 'On973jdn987', character, date, hour, event: 'ode09a198dn', message };

    return res.json(action);
  });

  app.put('/actions/:actionId', (req, res) => {
    return res.sendStatus(204);
  });

  app.use('*', (req, res) => {
    res.status(404);
    return res.json({ error: { name: 'PAGE_NOT_FOUND', status: 404, message: 'The requested resource does not exist.' } });
  });

  app.use((err, req, res, next) => {
    if (!err.status) {
      console.error(err);
    } else {
      console.log(err.name);
    }

    res.status(err.status || 500);

    return res.json({
      success: false,
      status: res.status,
      error: {
        message: err.status ? err.message : 'An unknown error occurred',
        name: err.status ? err.name : 'INTERNAL_SERVER_ERROR',
      },
    });
  });

  return app;
}

module.exports = init;

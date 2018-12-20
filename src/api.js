const cors = require('cors');
const express = require('express');

const { authenticate } = require('./middlewares/authentication.middleware');

const adminRouter = require('./routes/admin.routes');

function init(config) {
  const app = express();

  const mongoose = require('mongoose');
  mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });

  app.use(express.json({ urlextended: true }));
  app.use(cors());
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

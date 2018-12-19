const express = require('express');

function init(confing) {
  const app = express();

  app.use(express.json({ urlextended: true }));

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

  return app;
}

module.exports = init;

const express = require('express');
const Joi = require('joi');

const { BadRequestError, ConflictError, ForbiddenError, ResourceNotFoundError } = require('../errors');

const { requireAuthentication, verifyAdminRights, verifyApplicationRights } = require('../middlewares/authentication.middleware');

const Event = require('../models/event.model');
const User = require('../models/user.model');

const router = express.Router();

/**
 * EVENT SCHEMAS
 * @swagger
 *
 * components:
 *  schemas:
 *    EventSummary:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        active:
 *          type: boolean
 *          description: Prevent user from posting actions if false.
 *        owner:
 *          type: string
 *          description: User that own the event.
 *      example:
 *        id: '5c1c06cd8d93224570fcc65b'
 *        title: Prologue
 *        description: Le commencement de notre aventure !
 *        active: true
 *        owner: '5c1c06cd8d93224570fcc65b'
 *    EventDetails:
 *      allOf:
 *        - $ref: '#/components/schemas/EventSummary'
 *        - type: object
 *          properties:
 *            text:
 *              type: string
 *          example:
 *            text: Voici un texte de description complet de l'évènement, avec éventuellement des intrusctions, etc.
 *    EventCreate:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        text:
 *           type: string
 *        active:
 *          type: boolean
 *          description: Prevent user from posting actions if false.
 *        owner:
 *          type: string
 *          description: User that own sthe event. Default to bearer of the token.
 *      required:
 *        - title
 *        - description
 *      example:
 *        title: Prologue
 *        description: Le commencement de notre aventure !
 *        text: Voici un texte de description complet de l'évènement, avec éventuellement des intrusctions, etc.
 *        active: true
 *        owner: '5c1c06cd8d93224570fcc65b'
 */

router.use(requireAuthentication);

/**
 * @swagger
 *
 * /events:
 *  get:
 *    operationId: getEvents
 *    tags:
 *      - events
 *    security:
 *      - user: []
 *      - application: []
 *    responses:
 *      200:
 *        description: List of events the user may access.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/EventSummary'
 */
router.get('/events', async (req, res, next) => {
  try {
    const events = await Event.find({}, 'id title active description text owner').populate('owner', 'id username');

    return res.json(events);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 *
 * /events:
 *  post:
 *    operationId: createEvent
 *    tags:
 *      - events
 *    security:
 *      - user: []
 *      - application: []
 *    requestBody:
 *      description: Event to create
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventCreate'
 *    responses:
 *      201:
 *        description: Event created.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventDetails'
 */
router.post('/events', async (req, res, next) => {
  try {
    const { title, description, text, owner = req.locals.authentication.data.user_id } = req.body;

    const result = Joi.validate({ title, description, text, owner }, Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string().required(),
      text: Joi.string().max(4000),
      owner: Joi.string(),
    }));

    if (result.error) {
      throw new BadRequestError(`body should be { }. Details: ${result.error.details.map(e => e.message).join(', ')}`)
    }

    const user = await User.findOne({ _id: owner });

    if (!user) {
      throw new BadRequestError('User not found.');
    }

    const eventFound = await Event.findOne({ active: true, title });

    if (eventFound) {
      throw new ConflictError('There is already an active event with the same title.');
    }

    const event = new Event({ title, description, text, owner: user._id });
    await event.save();

    const createdEvent = await Event.findOne({ active: true, title }, 'id title active description text owner').populate('User', 'id username');

    return res.json(createdEvent);
  } catch (err) {
    return next(err);
  }
});

/**
 * @swagger
 *
 * /events/{eventId}:
 *  get:
 *    operationId: Get event details and last infos.
 *    tags:
 *      - events
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *    responses:
 *      200:
 *        description: Event requested.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventDetails'
 */
router.get('/events/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ _id: eventId }, 'id title active description text owner').populate('owner', 'id username');

    if (!event) {
      throw new ResourceNotFoundError('No event found with this ID.');
    }

    return res.json(event);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 *
 * /events/{eventId}:
 *  patch:
 *    operationId: updateEvent
 *    tags:
 *      - events
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *    requestBody:
 *      description: Event to update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      200:
 *        description: Updated Event
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventDetails'
 */
router.patch('/events/:eventId', (req, res) => {

});

/**
 * @swagger
 *
 * /events/{eventId}:
 *  delete:
 *    operationId: archiveEvent
 *    tags:
 *      - events
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *    responses:
 *      204:
 *        description: Event archived
 */
router.delete('/events/:eventId', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      throw new ResourceNotFoundError('No event found with this ID.');
    }

    if (verifyAdminRights(req.locals.authentication) || verifyApplicationRights(req.locals.authentication) || event.owner._id === req.locals.authentication.data.user_id) {
      await event.update({ active: false });
    } else {
      throw new ForbiddenError('You are not authorized to archive this event');
    }

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

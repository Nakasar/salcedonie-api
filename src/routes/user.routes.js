const express = require('express');
const Joi = require('joi');

const { BadRequestError, ResourceNotFoundError } = require('../errors');

const { requireAuthentication, requireAdminRights, requireApplicationAuthentication } = require('../middlewares/authentication.middleware');

const router = express.Router();

/**
 * SECURITY SCHEME: user
 * @swagger
 *
 * components:
 *  securitySchemes:
 *    user:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * SECURITY SCHEME: application
 * @swagger
 *
 * components:
 *  securitySchemes:
 *    application:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

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

/**
 * CHARACTER SCHEMAS
 * @swagger
 *
 * components:
 *  schemas:
 *    CharacterSummary:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        owner:
 *          type: string
 *          description: User that owns the character.
 *      example:
 *        id: '5c1c06cd8d93224570fcc65b'
 *        name: Henry Flore
 *        description: Le grand héros de tous les temps !
 *    CharacterDetails:
 *      allOf:
 *        - $ref: '#/components/schemas/CharacterSummary'
 *    CharacterCreate:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        description:
 *          type: string
 *        owner:
 *          type: string
 *          description: User that owns the character. Default to bearer of the token.
 *      required:
 *        - name
 *        - description
 *      example:
 *        name: Henry Flore
 *        description: Le grand héros de tous les temps !
 *        owner: '5c1c06cd8d93224570fcc65b'
 */

/**
 * ACTION SCHEMAS
 * @swagger
 *
 * components:
 *  schemas:
 *    ActionSummary:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        title:
 *          type: string
 *        event:
 *          type: string
 *        date:
 *          type: string
 *        time:
 *          type: string
 *        location:
 *          type: string
 *        description:
 *          type: string
 *        character:
 *          type: string
 *      example:
 *        id: '5c1c06cd8d93224570fcc65b'
 *        title: Un verre au bar
 *        event: '5c1c06cd8d93224570fcc65b'
 *        date: jour 12
 *        time: matin
 *        location: Au bar de Frid
 *        description: Henry s'empare d'un verre et le descend d'une traite.
 *        character: '5c1c06cd8d93224570fcc65b'
 *    ActionDetails:
 *      allOf:
 *        - $ref: '#/components/schemas/CharacterSummary'
 *    ActionCreate:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *        date:
 *          type: string
 *        time:
 *          type: string
 *        location:
 *          type: string
 *        description:
 *          type: string
 *        character:
 *          type: string
 *          description: Character that execute the action, default to user default character if set.
 *      required:
 *        - title
 *        - date
 *        - time
 *        - location
 *        - description
 *      example:
 *        title: Un verre au bar
 *        event: '5c1c06cd8d93224570fcc65b'
 *        date: jour 12
 *        time: matin
 *        location: Au bar de Frid
 *        description: Henry s'empare d'un verre et le descend d'une traite.
 *        character: '5c1c06cd8d93224570fcc65b'
 */

router.use(requireAuthentication);

/**
 * PARAMETER: userId
 * @swagger
 *
 * components:
 *  parameters:
 *    userId:
 *      name: userId
 *      in: path
 *      required: true
 *      description: User ID
 *      schema:
 *        type: string
 *        example: '5c1c06cd8d93224570fcc65b'
 */

/**
 * PARAMETER: characterId
 * @swagger
 *
 * components:
 *  parameters:
 *    characterId:
 *      name: characterId
 *      in: path
 *      required: true
 *      description: Character ID
 *      schema:
 *        type: string
 *        example: '5c1c06cd8d93224570fcc65b'
 */

/**
 * PARAMETER: eventId
 * @swagger
 *
 * components:
 *  parameters:
 *    eventId:
 *      name: eventId
 *      in: path
 *      required: true
 *      description: Event ID
 *      schema:
 *        type: string
 *        example: '5c1c06cd8d93224570fcc65b'
 */

/**
 * PARAMETER: actionId
 * @swagger
 *
 * components:
 *  parameters:
 *    actionId:
 *      name: actionId
 *      in: path
 *      required: true
 *      description: Action ID
 *      schema:
 *        type: string
 *        example: '5c1c06cd8d93224570fcc65b'
 */

/**
 * ROUTE: /users, getUsers
 * @swagger
 *
 * /users:
 *  get:
 *    operationId: getUsers
 *    summary: Get existing users
 *    description: >-
 *      Get existing users summaries. Admin will retrieve full user objects, whereas application may only retrieve
 *      user id and discord_id.
 *    tags:
 *      - users
 *    parameters:
 *      - name: discord_id
 *        in: query
 *        description: search by exact match on discord_id
 *        schema:
 *          type: integer
 *          example: 11119836820
 *    security:
 *      - admin: []
 *      - application: []
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
router
  .get('/users', requireAdminRights, async (req, res, next) => {
    try {
      const users = await User.find({}, 'id username discord_id');

      return res.json(users);
    } catch (err) {
      return next(err);
    }
  })
  .get('/users', requireApplicationAuthentication, async (req, res, next) => {
    try {
      const { discord_id } = req.query;

      const query = {};

      if (discord_id) {
        query.discord_id = discord_id;
      }

      const users = await User.find(query, 'id discord_id');

      return res.json(users);
    } catch (err) {
      return next(err);
    }
  });

/**
 * @swagger
 *
 * /users/{userId}/default-character:
 *  get:
 *    operationId: getUserDefaultCharacter
 *    tags:
 *      - users
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/userId'
 *    responses:
 *      200:
 *        description: Default character of user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CharacterDetails'
 */
router.get('/users/:userId/default-character', (req, res) => {

});

/**
 * @swagger
 *
 * /users/{userId}/default-character:
 *  post:
 *    operationId: updateUserDefaultCharacter
 *    tags:
 *      - users
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/userId'
 *    requestBody:
 *      description: Default character id to set as default
 *      content:
 *        application/json:
 *          schema:
 *            type: string
 *            example: '5c1c06cd8d93224570fcc65b'
 *    responses:
 *      200:
 *        description: Default character of user set.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CharacterDetails'
 */
router.post('/users/:userId/default-character', (req, res) => {

});

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
router.get('/events', (req, res) => {

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
router.post('/events', (req, res) => {

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
router.get('/events/:eventId', (req, res) => {

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
router.delete('/events/:eventId', (req, res) => {

});

/**
 * @swagger
 *
 * /events/{eventId}/actions:
 *  get:
 *    operationId: Get last actions in event
 *    tags:
 *      - actions
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *    responses:
 *      200:
 *        description: List of actions of event.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ActionSummary'
 */
router.get('/events/:eventId/actions', (req, res) => {

});

/**
 * @swagger
 *
 * /events/{eventId}/actions:
 *  post:
 *    operationId: postAction
 *    tags:
 *      - actions
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *    requestBody:
 *      description: Action to create
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ActionCreate'
 *    responses:
 *      201:
 *        description: Created Action
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ActionDetails'
 */
router.post('/events/:eventId/actions', (req, res) => {

});

/**
 * @swagger
 *
 * /events/{eventId}/actions/{actionId}:
 *  get:
 *    operationId: getAction
 *    tags:
 *      - actions
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *      - $ref: '#/components/parameters/actionId'
 *    responses:
 *      200:
 *        description: Requested Action
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ActionDetails'
 */
router.get('/events/:eventId/actions/:actionId', (req, res) => {

});

/**
 * @swagger
 *
 * /events/{eventId}/actions/{actionId}:
 *  patch:
 *    operationId: updateAction
 *    tags:
 *      - actions
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *      - $ref: '#/components/parameters/actionId'
 *    requestBody:
 *      description: Action to update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      200:
 *        description: Updated Action
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ActionDetails'
 */
router.patch('/events/:eventId/actions/:actionId', (req, res) => {

});

/**
 * @swagger
 *
 * /events/{eventId}/actions/{actionId}:
 *  delete:
 *    operationId: deleteAction
 *    tags:
 *      - actions
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/eventId'
 *      - $ref: '#/components/parameters/actionId'
 *    responses:
 *      204:
 *        description: Action deleted
 */
router.delete('/events/:eventId/actions/:actionId', (req, res) => {

});

/**
 * @swagger
 *
 * /characters:
 *  get:
 *    operationId: Get characters
 *    tags:
 *      - characters
 *    security:
 *      - user: []
 *      - application: []
 *    responses:
 *      200:
 *        description: List of characters
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CharacterSummary'
 */
router.get('/characters', (req, res) => {

});

/**
 * @swagger
 *
 * /characters:
 *  post:
 *    operationId: createCharacter
 *    tags:
 *      - characters
 *    security:
 *      - user: []
 *      - application: []
 *    requestBody:
 *      description: Character to create
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CharacterCreate'
 *    responses:
 *      201:
 *        description: Created character
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CharacterDetails'
 */
router.post('/characters', (req, res) => {

});

/**
 * @swagger
 *
 * /characters/{characterId}:
 *  get:
 *    operationId: Get character details
 *    tags:
 *      - characters
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/characterId'
 *    responses:
 *      200:
 *        description: Requested Character
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CharacterDetails'
 */
router.get('/characters/:characterId', (req, res) => {

});

/**
 * @swagger
 *
 * /characters/{characterId}:
 *  patch:
 *    operationId: updateCharacter
 *    tags:
 *      - characters
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/characterId'
 *    requestBody:
 *      description: Character to update
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *    responses:
 *      200:
 *        description: Updated Character
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CharacterDetails'
 */
router.patch('/characters/:characterId', (req, res) => {

});

/**
 * @swagger
 *
 * /characters/{characterId}/actions:
 *  get:
 *    operationId: getCharacterActions
 *    tags:
 *      - actions
 *    security:
 *      - user: []
 *      - application: []
 *    parameters:
 *      - $ref: '#/components/parameters/characterId'
 *    responses:
 *      200:
 *        description: List of actions of character.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ActionSummary'
 */
router.get('/characters/:characterId/actions', (req, res) => {

});

/**
 * @swagger
 *
 * /actions:
 *  get:
 *    operationId: getActions
 *    tags:
 *      - actions
 *    security:
 *      - user: []
 *      - application: []
 *    responses:
 *      200:
 *        description: List of actions
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ActionSummary'
 */
router.get('/actions', (req, res) => {

});

module.exports = router;
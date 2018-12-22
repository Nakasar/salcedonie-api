const express = require('express');
const Joi = require('joi');

const { BadRequestError, ResourceNotFoundError } = require('../errors');

const { requireAuthentication } = require('../middlewares/authentication.middleware');

const router = express.Router();

router.use(requireAuthentication);


/**
 * @swagger
 *
 * /users/{userId}/default-character:
 *  get:
 *    operationId: getUserDefaultCharacter
 *    tags:
 *      - users
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
 */
router.get('/actions', (req, res) => {

});

return router;
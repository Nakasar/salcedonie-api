const { ForbiddenError, MissingAuthenticationError } = require('../errors');

const TokenService = require('../services/token.service');

async function authenticate(req, res, next) {
    const token = getToken(req.headers);

    let authentication = null;

    if (token) {
        try {
            const payload = await TokenService.verify(token);

            authentication = { is_valid: true, data: payload };
        } catch(err) {
            authentication = { is_valid: false };
        }
    }

    req.locals = req.locals || {};
    req.locals.authentication = authentication;

    next()
}

function getToken({ authorization }) {
    if (!authorization) { return null; }

    const token = authorization.split('Bearer ')[1];

    if (!token) { return null; }

    return token;
}

function requireAdminRights(req, res, next) {
    try {
        verifyAuthentication(req.locals);

        if (verifyAdminRights(req.locals.authentication.data)) {
            return next();
        } else {
            throw new ForbiddenError('Administrator privileges are required.');
        }
    } catch (err) {
        return next(err);
    }
}

function requireAuthentication(req, res, next) {
    try {
        verifyAuthentication(req.locals);

        return next();
    } catch (err) {
        return next(err);
    }
}

function verifyAdminRights(data) {
    return data && data.is_admin;
}

function verifyAuthentication(locals) {
    if (!locals || !locals.authentication) {
        throw new MissingAuthenticationError("'Authentication: Bearer [token]' is required in headers.");
    }

    if (!locals.authentication.is_valid) {
        throw new ForbiddenError("'Authentication: Bearer [token]' in header is not valid or has expired.");
    }

    return true;
}

module.exports = {
    authenticate,
    requireAdminRights,
    requireAuthentication,
};

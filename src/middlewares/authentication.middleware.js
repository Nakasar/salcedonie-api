const { ForbiddenError, MissingAuthenticationError } = require('../errors');

const TokenService = require('../services/token.service');

const AUTHENTICATION_TYPES = {
    USER: 'USER',
    APPLICATION: 'APPLICATION',
};

const authenticationStrategies = {
    BEARER: {
        validate: async ({ authorization }) => {
            let authentication = null;

            if (!authorization) { return authentication; }

            const token = authorization.split('Bearer ')[1];

            if (token) {
                try {
                    const payload = await TokenService.verify(token);

                    authentication = { is_valid: true, type: AUTHENTICATION_TYPES.USER, data: payload };
                } catch(err) {
                    authentication = { is_valid: false, errorDetails: 'token in AUTHORIZATION header is not valid or has expired.' };
                }
            } else {
                authentication = { is_valid: false, errorDetails: "token in AUTHORIZATION header must be of Bearer Scheme: 'AUTHORIZATION=Bearer [TOKEN]'." };

                return authentication;
            }

            return authentication;
        },
    },
    API_KEY: {
        validate: ({ api_key }) => {
            let authentication = null;

            if (!api_key) { return authentication; }

            // TODO: validate API_KEY
            authentication = { is_valid: true, type: AUTHENTICATION_TYPES.APPLICATION, data: { application_name: 'salcedonie-discord-bot' } };

            return authentication;
        },
    },
};

async function authenticate(req, res, next) {
    const authenticationStrategy = getAuthenticationStrategy(req.headers);

    req.locals = req.locals || {};
    req.locals.authentication = authenticationStrategy ? authenticationStrategy.validate(req.headers) : null;

    return next();
}

function getAuthenticationStrategy(headers) {
    if (headers.api_key) {
        return authenticationStrategies.API_KEY;
    }

    if (headers.authorization) {
        return authenticationStrategies.BEARER;
    }

    return null;
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

function requireApplicationAuthentication(req, res, next) {
    try {
        verifyAuthentication(req.locals);

        if (locals.authentication.type === AUTHENTICATION_TYPES.APPLICATION) {
            return next();
        } else {
            throw new ForbiddenError('Application authentication is required to perform this action.');
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
        throw new MissingAuthenticationError("One of 'AUTHENTICATION: Bearer [token]', 'API_KEY: [api_key]' is required in headers.");
    }

    if (!locals.authentication.is_valid) {
        throw new ForbiddenError("'Authentication: Bearer [token]' in header is not valid or has expired.");
    }

    return true;
}

module.exports = {
    authenticate,
    requireAdminRights,
    requireApplicationAuthentication,
    requireAuthentication,
};

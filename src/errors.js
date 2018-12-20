class BadRequestError extends Error {
    constructor(message, id) {
        super(message);
        this.status = 400;
        this.name = id || 'BAD_REQUEST';
    }
}

class ForbiddenError extends Error {
    constructor(message, id) {
        super(message);
        this.status = 403;
        this.name = id || 'FORBIDDEN';
    }
}

class MissingAuthenticationError extends Error {
    constructor(message, id) {
        super(message);
        this.status = 401;
        this.name = id || 'MISSING_AUTHORIZATION';
    }
}

module.exports = {
    BadRequestError,
    ForbiddenError,
    MissingAuthenticationError,
};

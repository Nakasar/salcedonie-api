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

class ResourceNotFoundError extends Error {
    constructor(message, id) {
        super(message);
        this.status = 404;
        this.name = id || 'NOT_FOUND';
    }
}

module.exports = {
    BadRequestError,
    ForbiddenError,
    MissingAuthenticationError,
    ResourceNotFoundError,
};

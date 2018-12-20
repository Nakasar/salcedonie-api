module.exports = {
    info: {
        title: 'Salcedonie API',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'https://api.salcedonie.nakasar.me',
        },
        {
            url: 'http://localhost:5000',
        },
    ],
    openapi: '3.0.0',
    apis: ['./src/**/*.js'],
};

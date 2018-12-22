const APPLICATIONS = [
  { name: 'salcedonie-discord-bot', key: process.env.DISCORD_API_KEY },
];

module.exports = {
  findOne: async ({ api_key }) => APPLICATIONS.find(app => app.key === api_key),
};

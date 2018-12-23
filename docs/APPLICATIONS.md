# Usage of Salcedonie-API in applications.

## Web applications
Please provide user a way to use their credentials to generate an Access Token to the `POST /auth` route.
Use the generated access token to consume the API.

There is currently no way to refresh the token.

## Bot application.
You won't probably be able to ask user credentials as you only have a chat interface.

The API only support discord, and store the discord unique identifier of the user.
Bots should store a map of <discord_ID, user_id>, that they may access with their application key at
`GET /users?discord_id=11198749982`. As they are probably not subject to change, you should use a cache strategy
in your application.

Indeed, this is NOT SECURE, as the flow should use OAuth authentication grants and permission scopes.
I know, and I don't care for this application.
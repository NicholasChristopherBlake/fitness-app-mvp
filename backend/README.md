# Backend

Backend PORT = 4000
Frontend PORT = 3000

## Packages

pnpm - Package manager

### Dependencies

- express
- prisma@client - Prisma client
- dotenv - for working with .env variables
- cors - for allowing browser to send requests to our server
- cookie-parser - for working with httpOnly cookies for Refresh Token

### Dev Dependecies

- prisma - ORM for working with PostgreSQL (uses pg under the hood)
- ts-node-dev - like nodemon (for dev server reload) but for Typescript
  ts-node is not needed then
  --respawn flag for restarting server if it crashes

- typescript and types

## Backend Architecture

MVC

## Authentication

JWT Auth with Access/Refresh Token
Access Token is kept in local storage
Refresh Token is kept in httpOnly cookies

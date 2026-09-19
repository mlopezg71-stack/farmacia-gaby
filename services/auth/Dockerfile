FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://farmacia_user:cambiar_esta_contrasena@localhost:5432/gaby_auth?schema=public"

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
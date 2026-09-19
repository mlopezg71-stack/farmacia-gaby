FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://farmacia_user:cambiar_esta_contrasena@postgres:5432/farmacia_gaby"

RUN npx prisma generate

EXPOSE 3002

CMD ["npm", "start"]
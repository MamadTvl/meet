###################
# BUILD FOR FRONTEND
###################

FROM node:18 As build-frontend

WORKDIR /usr/src/app
ENV NODE_ENV PRODUCTION

ARG API_BASE_URL
ENV VITE_API_BASE_URL ${API_BASE_URL}

ARG SOCKET_URL 
ENV VITE_SOCKET_URL ${SOCKET_URL}

COPY --chown=node:node ./frontend ./

RUN yarn

# Bundle app source
COPY --chown=node:node . .
RUN yarn build

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR BACKEND
###################

FROM node:18-alpine As build-backend

WORKDIR /usr/src/app

COPY --chown=node:node ./backend ./

# Run the build command which creates the production bundle
RUN yarn

# Set NODE_ENV environment variable
ENV NODE_ENV production

RUN yarn build &&  yarn install --production

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production
WORKDIR /app
# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build-backend /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build-backend /usr/src/app/dist ./dist

COPY --chown=node:node --from=build-frontend /usr/src/app/dist ./public

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

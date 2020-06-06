FROM node:12
WORKDIR /usr/app
COPY . /usr/app
RUN ["yarn"]
RUN ["yarn", "build"]
CMD ["yarn", "start"]
# base used
FROM telkomindonesia/alpine:nodejs-8.9.3

# maintainer
MAINTAINER Aas Suhendar <aas.suhendar@gmail.com>

# Environment
ENV PM2_INSTANCE 1

# Add workdir
WORKDIR /usr/src/app

# Cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app \
  && cp -a /tmp/node_modules /usr/src

# Add project files
ADD . /usr/src/app

# update node_module, and change permission

# setting native node js
# RUN rm -rf node_modules \
#   && mv /usr/src/node_modules /usr/src/app/ \
#   && chmod -R 775 public/uploaded

# setting pm2 
# RUN rm -rf node_modules \
#   && mv /usr/src/node_modules /usr/src/app/ \
#   && chmod -R 775 public/uploaded \
#   && mkdir -p /.pm2 \
#   && chown -R user:root /.pm2 \
#   && chmod 775 /.pm2 

# expose port
EXPOSE 3000

# RUN command

# RUN command native
# CMD ["npm","start"]

# RUN command pm2
CMD ["sh","-c","pm2 start bin/www --no-daemon -i $PM2_INSTANCE"]
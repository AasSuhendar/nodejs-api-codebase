# base used
FROM telkomindonesia/alpine:nodejs-8.9.3

# maintainer
LABEL maintainer="Aas Suhendar <aas.suhendar@gmail.com>"

# Environment
ENV PM2_INSTANCE 1

# Add workdir
WORKDIR /usr/src/app

# Cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm i -g npm && npm install
RUN mkdir -p /usr/src/app \
  && cp -a /tmp/node_modules /usr/src

# Add project files
ADD . /usr/src/app

# update node_module, and change permission
# setting native node js
# RUN rm -rf node_modules \
#   && mv /usr/src/node_modules /usr/src/app/ \

# setting pm2 
RUN rm -rf node_modules \
  && mv /usr/src/node_modules /usr/src/app/ \
  && mkdir -p /.pm2 \
  && chown -R user:root /.pm2 \
  && chmod 775 /.pm2 \
  && chmod -R 775 uploaded

# expose port
EXPOSE 3000

# RUN command native
# CMD ["npm","start"]

# Healthcheck
HEALTHCHECK --interval=3s --timeout=3s CMD ["curl", "http://127.0.0.1:3000/health"] || exit 1
VOLUME ["/usr/src/app/uploaded"]
# RUN command pm2
CMD ["sh","-c","pm2 start bin/www --no-daemon -i $PM2_INSTANCE"]
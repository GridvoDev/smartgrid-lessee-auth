FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/smartgrid-lessee-auth/package.json
WORKDIR /home/smartgrid-lessee-auth
RUN ["npm","install","mocha@2.5.3"]
RUN ["npm","install","muk@0.5.2"]
RUN ["npm","install","should@9.0.2"]
RUN ["npm","install","supertest@2.0.0"]
RUN ["npm","install","async@2.0.0-rc.6"]
RUN ["npm","install","bearcat@0.4.29"]
RUN ["npm","install","body-parser@1.15.1"]
RUN ["npm","install","multer@1.2.0"]
RUN ["npm","install","express@4.13.4"]
RUN ["npm","install","kafka-node@0.5.8"]
RUN ["npm","install","mongodb@2.1.18"]
RUN ["npm","install","request@2.73.0"]
RUN ["npm","install","underscore@1.8.3"]
COPY ./app.js app.
COPY ./lib libjs
COPY ./test test
COPY ./unittest_application_bcontext.json unittest_application_bcontext.json
COPY ./unittest_express_bcontext.json unittest_express_bcontext.json
COPY ./unittest_kafka_bcontext.json unittest_kafka_bcontext.json
COPY ./production_bcontext.json production_bcontext.json
VOLUME ["/home/smartgrid-lessee-auth"]
ENTRYPOINT ["node"]
CMD ["app.js"]
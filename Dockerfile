FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/smartgrid-lessee-auth/
WORKDIR /home/smartgrid-lessee-auth
RUN ["npm","install"]
COPY ./app.js app.js
COPY ./lib lib
COPY ./test test
COPY ./unittest_bcontext.json unittest_bcontext.json
COPY ./unittest_testbcontext.json unittest_testbcontext.json
COPY ./unittest_ctestbcontext.json unittest_ctestbcontext.json
VOLUME ["/home/smartgrid-lessee-auth"]
ENTRYPOINT ["node"]
CMD ["app.js"]
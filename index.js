import Koa from 'koa';
import _ from 'koa-route';
import bodyParser from 'koa-bodyparser';

import config from '~/lib/config';
// import { respondToMessages } from '~/lib/session';

const app = new Koa();
app.use(bodyParser());

app.use(_.get('/', (ctx) => {
    ctx.body = 'ok';
}));


app.use(_.post('/flowbot', (ctx) => {
    console.log(ctx.request);
    ctx.body = 'post';
}));

const port = process.env.PORT || config.port || 3000;
app.listen(port);

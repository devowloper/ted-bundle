```typescript
import { createShopifyAuth, verifyRequest } from '@shopify/koa-shopify-auth';
import { receiveWebhook } from '@shopify/koa-shopify-webhooks';
import Koa from 'koa';
import Router from 'koa-router';
import { default as Shopify, ApiVersion } from '@shopify/shopify-api';

const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, SCOPES } = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ''),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const server = new Koa();
const router = new Router();

server.keys = [Shopify.Context.API_SECRET_KEY];

router.get(
  '/auth',
  createShopifyAuth({
    accessMode: 'offline',
    async afterAuth(ctx) {
      const { shop, accessToken } = ctx.state.shopify;
      ctx.cookies.set('shopOrigin', shop, { httpOnly: false });
      ctx.redirect('/');
    },
  }),
);

router.post('/webhooks', receiveWebhook({ secret: SHOPIFY_API_SECRET }), (ctx) => {
  console.log('received webhook: ', ctx.state.webhook);
});

router.get('(/_)?/graphql', verifyRequest(), async (ctx, next) => {
  await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
});

server.use(router.allowedMethods());
server.use(router.routes());
server.listen(8081, () => {
  console.log('Server is listening on port 8081');
});
```
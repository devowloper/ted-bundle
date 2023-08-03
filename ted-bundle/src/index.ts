```typescript
import { RemixServer } from '@remix-run/server-runtime';
import express from 'express';
import { createRequestHandler } from '@remix-run/express';

const app = express();

app.all(
  '*',
  createRequestHandler({
    getLoadContext() {
      // Whatever you return here will be passed as `context` to your loaders.
    },
  })
);

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
```
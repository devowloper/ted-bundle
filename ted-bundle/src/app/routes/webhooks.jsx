```jsx
import { json, LoaderFunction, useRouteData } from 'remix';
import { Webhooks } from '@shopify/shopify-app-remix';
import { shopify } from '../shopify.server';

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await shopify.authenticate.admin(request);
  const response = await admin.graphql(`
    {
      webhooks(first: 25) {
        nodes {
          id
          topic
          address
        }
      }
    }
  `);
  const {
    data: {
      webhooks: { nodes },
    },
  } = await response.json();
  return json(nodes);
};

export default function WebhooksRoute() {
  const webhooks = useRouteData();

  return (
    <div>
      <h1>Webhooks</h1>
      <ul>
        {webhooks.map((webhook) => (
          <li key={webhook.id}>
            <p>Topic: {webhook.topic}</p>
            <p>Address: {webhook.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

Webhooks.Route = {
  path: '/webhooks',
  meta: {
    title: 'Webhooks',
    description: 'List of all webhooks',
  },
  loader,
};
```
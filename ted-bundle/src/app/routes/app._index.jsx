```jsx
import { json, useLoaderData } from '@remix-run/react';
import { Link } from 'react-router-dom';
import { Card, Page, Layout, TextStyle } from '@shopify/polaris';

export default function Index() {
  let data = useLoaderData();

  return (
    <Page title="Product Bundles">
      <Layout>
        {data.map((product, index) => (
          <Layout.Section key={index}>
            <Card sectioned>
              <Link to={`/product/${product.id}`}>
                <TextStyle variation="strong">{product.title}</TextStyle>
              </Link>
              <p>{product.description}</p>
            </Card>
          </Layout.Section>
        ))}
      </Layout>
    </Page>
  );
}

export async function loader({ request }) {
  const { admin } = await shopify.authenticate.admin(request);

  const response = await admin.graphql(`
    {
      products(first: 25) {
        nodes {
          id
          title
          description
        }
      }
    }
  `);

  const {
    data: {
      products: { nodes },
    },
  } = await response.json();

  return json(nodes);
}
```
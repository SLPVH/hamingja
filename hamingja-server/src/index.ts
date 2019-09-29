import "reflect-metadata";
import { createExpressServer } from 'routing-controllers';
import { AddressController } from './controllers/address.controller';

const port = parseInt(process.env.PORT || '3000');
const host = process.env.HOST || 'localhost';

async function main() {
  const app = createExpressServer({
    cors: true,
    controllers: [AddressController]
  });

  app.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`);
  });
}
main();

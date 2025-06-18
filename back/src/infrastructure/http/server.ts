import 'reflect-metadata';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import './config/env';
import { ApolloServer } from '@apollo/server';
import { koaMiddleware } from "@as-integrations/koa";
import { buildSchema } from 'type-graphql';
import { UserResolver } from '@/api/graphql/resolvers/user.resolver';
import { MyContext } from '@/api/types/context.type';
import { AuthenticatedUser } from '@/api/types/authenticatedUser.type';
// import { createLeakyBucketMiddleware } from '@/application/shared/middlewares/leackyBucket.middleware';
import { connectMongo } from '@/infrastructure/database/mongo/client.mongoose.config';
import { queues } from '@/infrastructure/queue/queue.config';
import '@/infrastructure/queue/workers/user.worker';
import cors from '@koa/cors';
import { UserService } from '@/core/services/user.service';
import { userRepository } from '@/core/repositories/user.repository';

async function bootstrap() {
  await connectMongo();
  const app = new Koa();
  const router = new Router({prefix: '/api'});
  const port: number = parseInt(process.env.PORT || '3000', 10);
  const graphqlPath: string = '/graphql';

  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: process.env.NODE_ENV === 'production',
  });

  const apolloServer = new ApolloServer<MyContext>({ schema });
  await apolloServer.start();

  app.use(cors({ origin: '*' }));
  app.use(bodyParser());

  router.all(graphqlPath, koaMiddleware(apolloServer, {
    context: async ({ ctx }): Promise<MyContext> => {
      const token = ctx.request.headers.authorization || '';
      const user = ctx.state.user as AuthenticatedUser | undefined;

      return {
        user,
        token
      };
    },
  }));

  router.get('/health', (ctx: Koa.Context) => {
    ctx.status = 200;
    ctx.body = {
      health: 'Online and Routing xD',
      timestamp: new Date().toISOString(),
      server: 'Koa + Apollo GraphQL',
      queues: Object.keys(queues).map(queue => ({
        name: queue,
        status: 'active'
      }))
    };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`GraphQL on http://localhost:${port}/api/${graphqlPath}`);
    console.log(`Health check on http://localhost:${port}/api/healthcheck`);
  });
}

bootstrap().catch(console.error);
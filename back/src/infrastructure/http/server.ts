import 'reflect-metadata';
import dotenv from 'dotenv';
import Koa from 'koa';
import { authMiddleware } from '@/application/shared/middlewares/auth.middleware';
import Router from 'koa-router';
import { ApolloServer } from '@apollo/server';
import { koaMiddleware } from "@as-integrations/koa";
import { buildSchema } from 'type-graphql';
import { UserResolver } from '@/application/interfaces/http/graphql/resolvers/user/user.resolver';
import { createLeakyBucketMiddleware } from '@/application/shared/middlewares/leackyBucket.middleware';

dotenv.config();

interface MyContext {
  user: any;
  token: string;
}

interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}

async function bootstrap() {
  const app = new Koa();
  const router = new Router();
  const port: number = 3000;
  const graphqlPath: string = '/graphql';

  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: process.env.NODE_ENV === 'prod',
  });

  const apolloServer = new ApolloServer<MyContext>({ schema });
  await apolloServer.start();
  app.use(createLeakyBucketMiddleware());
  app.use(authMiddleware);
  app.use(
    koaMiddleware(apolloServer, {
      context: async ({ ctx }): Promise<MyContext> => {
        const token = ctx.request.headers.authorization || '';
        const user = ctx.state.user as AuthenticatedUser | undefined;
        return { user: user, token };
      },
    })
  );

  router.get('/health', (ctx: Koa.Context) => {
    ctx.status = 200;
    ctx.body = {
      health: 'ok',
      timestamp: new Date().toISOString(),
      server: 'Koa + Apollo GraphQL'
    };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(port, () => {
    console.log(`Koa ready on http://localhost:${port}`);
    console.log(`GraphQL on http://localhost:${port}${graphqlPath}`);
    console.log(`Health check on http://localhost:${port}/health`);
  });
}

bootstrap();
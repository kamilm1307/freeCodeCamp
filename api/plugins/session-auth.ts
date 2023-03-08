import { FastifyPluginCallback, onRequestHookHandler } from 'fastify';
import fp from 'fastify-plugin';

const sessionAuth: FastifyPluginCallback = (fastify, _opts, done) => {
  const authenticateSession: onRequestHookHandler = (req, res, done) => {
    if (!req.session.user) {
      res.statusCode = 401;
      return res.send({ msg: 'Unauthorized' });
    }
    done();
  };

  fastify.decorate('authenticateSession', authenticateSession);

  done();
};

declare module 'fastify' {
  interface FastifyInstance {
    authenticateSession: onRequestHookHandler;
  }
}

export default fp(sessionAuth);

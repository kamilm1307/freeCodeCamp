import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { type user } from '@prisma/client';

import { JWT_SECRET } from '../utils/env';
import { type Token, isExpired } from '../utils/tokens';
import { CODE, STATUS } from '../utils';

declare module 'fastify' {
  interface FastifyReply {
    setAccessTokenCookie: (this: FastifyReply, accessToken: Token) => void;
  }

  interface FastifyRequest {
    // TODO: is the full user the correct type here?
    user: user | null;
    accessDeniedMessage: { type: 'info'; content: string } | null;
  }

  interface FastifyInstance {
    authorize: (req: FastifyRequest, reply: FastifyReply) => void;
    authorizeExamEnvironmentToken: (
      req: FastifyRequest,
      reply: FastifyReply
    ) => void;
  }
}

const auth: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.decorateReply('setAccessTokenCookie', function (accessToken: Token) {
    const signedToken = jwt.sign({ accessToken }, JWT_SECRET);
    void this.setCookie('jwt_access_token', signedToken, {
      httpOnly: false,
      secure: false,
      maxAge: accessToken.ttl
    });
  });

  fastify.decorateRequest('accessDeniedMessage', null);
  fastify.decorateRequest('user', null);

  const TOKEN_REQUIRED = 'Access token is required for this request';
  const TOKEN_INVALID = 'Your access token is invalid';
  const TOKEN_EXPIRED = 'Access token is no longer valid';

  const setAccessDenied = (req: FastifyRequest, content: string) =>
    (req.accessDeniedMessage = { type: 'info', content });

  const handleAuth = async (req: FastifyRequest) => {
    const tokenCookie = req.cookies.jwt_access_token;
    if (!tokenCookie) return setAccessDenied(req, TOKEN_REQUIRED);

    const unsignedToken = req.unsignCookie(tokenCookie);
    if (!unsignedToken.valid) return setAccessDenied(req, TOKEN_REQUIRED);

    const jwtAccessToken = unsignedToken.value;

    try {
      jwt.verify(jwtAccessToken, JWT_SECRET);
    } catch {
      return setAccessDenied(req, TOKEN_INVALID);
    }

    const { accessToken } = jwt.decode(jwtAccessToken) as {
      accessToken: Token;
    };

    if (isExpired(accessToken)) return setAccessDenied(req, TOKEN_EXPIRED);

    const user = await fastify.prisma.user.findUnique({
      where: { id: accessToken.userId }
    });
    if (!user) return setAccessDenied(req, TOKEN_INVALID);
    req.user = user;
  };

  async function handleExamEnvironmentTokenAuth(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const { 'exam-environment-authorization-token': encodedToken } =
      req.headers;

    if (!encodedToken || typeof encodedToken !== 'string') {
      return reply.send({
        status: STATUS.ERROR,
        message: {
          code: CODE.EINVAL_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN,
          text: 'EXAM-ENVIRONMENT-AUTHORIZATION-TOKEN header is a required string.'
        }
      });
    }

    try {
      jwt.verify(encodedToken, JWT_SECRET);
    } catch (e) {
      void reply.code(403);
      return reply.send({
        message: {
          code: CODE.EINVAL_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN,
          text: JSON.stringify(e)
        },
        status: STATUS.ERROR
      });
    }

    const payload = jwt.decode(encodedToken);

    if (typeof payload !== 'object' || payload === null) {
      void reply.code(500);
      return reply.send({
        status: STATUS.ERROR,
        message: {
          code: CODE.EINVAL_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN,
          text: 'Unreachable. Decoded token has been verified.'
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const examEnvironmentAuthorizationToken =
      payload['examEnvironmentAuthorizationToken'];

    if (typeof examEnvironmentAuthorizationToken !== 'string') {
      return reply.send({
        status: STATUS.ERROR,
        message: {
          code: CODE.EINVAL_EXAM_ENVIRONMENT_AUTHORIZATION_TOKEN,
          text: 'EXAM-ENVIRONMENT-AUTHORIZATION-TOKEN is not valid.'
        }
      });
    }

    const token =
      await fastify.prisma.examEnvironmentAuthorizationToken.findFirst({
        where: {
          id: examEnvironmentAuthorizationToken
        }
      });

    if (!token) {
      return {
        message: 'Token not found',
        status: STATUS.ERROR
      };
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id: token.userId }
    });
    if (!user) return setAccessDenied(req, TOKEN_INVALID);
    req.user = user;
  }

  fastify.decorate('authorize', handleAuth);
  fastify.decorate(
    'authorizeExamEnvironmentToken',
    handleExamEnvironmentTokenAuth
  );

  done();
};

export default fp(auth, { name: 'auth', dependencies: ['cookies'] });

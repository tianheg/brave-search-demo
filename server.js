import Fastify from 'fastify';
import fetch from 'node-fetch';

import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  translateTime: 'SYS:HH:MM:ss Z',
  messageFormat: '{msg} {req.method} {req.url}',
  include: "time,pid,level",
  hideObject: true,
  colorize: false
})

const logger = pino({ level: 'info' }, stream);
const app = Fastify({ logger });
app.register(import('@fastify/cors'));


const searchUrl = 'https://api.search.brave.com/res/v1/web/search';

app.get('/api/search', async (request, reply) => {
  const { q } = request.query;

  const headers = {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    'X-Subscription-Token': process.env.BRAVE_SEARCH_KEY || ''
  };

  try {
    const response = await fetch(`${searchUrl}?q=${encodeURIComponent(q)}`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with your request:', error);
    reply.code(500).send({ error: 'Internal server error' });
  }
});

if (process.env.NODE_ENV === "development") {
  /**
   * A function that asynchronously starts the application listening on port 3000.
   *
   * @return {Promise} A promise that resolves when the application starts listening successfully.
   */
  const start = async () => {
    try {
      await app.listen({ port: 3000 });
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };
  start();
}

export default app;
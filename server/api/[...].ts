import { createRouter, useBase } from 'h3';
import { initSocket, io } from '~~/server/socket';

const router = createRouter();

router.get(
  '/socket.io',
  defineEventHandler((event) => initSocket(event))
);

router.post(
  '/chat',
  defineEventHandler(async (event) => {
    const body = await readBody(event);
    console.log(body);

    io.of('/chat').emit('chat', { id: body.id, text: body.text });

    return {
      success: true
    };
  })
);

export default useBase('/api', router.handler);

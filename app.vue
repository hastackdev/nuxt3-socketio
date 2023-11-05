<template>
  <div class="relative w-full max-w-4xl mx-auto">
    <div class="relative flex flex-col-reverse h-[calc(100vh_-_4rem)] overflow-y-auto pt-4">
      <div v-for="(chat, i) in chats" class="relative flex mb-3" :class="chat.itsMe ? 'justify-end pl-10' : 'pr-10'" :key="i">
        <div
          class="inline-flex border rounded-t-xl px-3 py-2"
          :class="chat.itsMe ? 'bg-green-500/10 border-green-500 rounded-bl-xl' : 'bg-blue-500/10 border-blue-500 rounded-br-xl'"
        >
          {{ chat.content }}
        </div>
      </div>
    </div>

    <div class="flex items-center py-2 rounded-lg bg-gray-50">
      <textarea
        v-model="message"
        rows="1"
        class="block mr-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Your message..."
      ></textarea>
      <button
        type="submit"
        class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
        @click="onSend"
      >
        <svg class="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
          <path
            d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"
          />
        </svg>
        <span class="sr-only">Send message</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { io, type Socket } from 'socket.io-client';

interface Chat {
  content: string;
  itsMe: boolean;
}

const message = ref('');
const chats = ref<Chat[]>([]);
const socket = ref<Socket>();

async function onSend() {
  try {
    // await $fetch('/api/chat', {
    //   method: 'POST',
    //   body: {
    //     id: socket.value?.id,
    //     text: message.value
    //   }
    // });
    socket.value?.emit('chat', message.value);
    chats.value.unshift({
      itsMe: true,
      content: message.value
    });

    nextTick(() => (message.value = ''));
  } catch {
    // noop
  }
}

onMounted(() => {
  socket.value = io('/chat', {
    path: '/api/socket.io'
  });

  socket.value.on('chat', (response: Record<'id' | 'text', string>) => {
    if (socket.value?.id === response.id) {
      return;
    }

    chats.value.unshift({ content: response.text, itsMe: false });
  });
});

onBeforeUnmount(() => {
  socket.value?.disconnect();
});
</script>

<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import JFetch, { get, request } from 'jsonlee-fetch';
const testUrl = 'https://jsonplaceholder.typicode.com/todos/1';

const req = new JFetch({
  baseURL: 'https://restapi.amap.com/v3',
  headers: {
    'Content-Type': 'application/json',
  },
});
// req.responseInterceptor.use((res)=> {
//   console.log(res, 'interceptor');
//   return {a: res}
// })
// req.requestInterceptor.use((config)=> {
//   config.url = 'todos/2'
//   return config;
// })
const genParams = (params = {}) => {
  return { ...params, key: 'a512f63f8f2ab662a21bcc052da3ca30' };
};
const params = {
  keywords: '成都',
  offset: 10,
};
const controller = req.get('/place/text', genParams(params));
// controller.abort();
// const controller = JFetch.request(testUrl)
// const controller = get(testUrl)
// console.log(controller);
controller.then((res) => {
  console.log(res);
});
async function test() {
  // const res = await controller;
  // controller.abort();
  // console.log(res);
}
test();
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

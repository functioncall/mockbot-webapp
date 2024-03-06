import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/components/Main.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Main
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
// router.beforeEach((to, from, next) => {
//     next();
// });
export default router

// import Vue from 'vue';
// import VueRouter from 'vue-router';
// import NarrationSummary from '@/components/NarrationSummary.vue'
// import ShortenForm from '@/components/ShortenForm.vue'

// Vue.use(VueRouter);

// const routes = [
//   { path: '/', component: ShortenForm },
//   { path: '/narration-summary', component: NarrationSummary }
// ];

// const router = new VueRouter({
//   mode: 'history', // Use HTML5 History API
//   routes
// });

// export default router;


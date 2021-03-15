import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

const ComponentContext = require.context('../components', true, /\.vue$/i, 'lazy');

ComponentContext.keys().forEach((componentFilePath) => {
  const componentName = componentFilePath.split('/').pop().split('.')[0].toLowerCase();
  Vue.component(componentName, () => ComponentContext(componentFilePath));
});

Vue.use(VueRouter)
Vue.use(hljs.vuePlugin);

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}

import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
// import VueHighlightJS from 'vue-highlightjs'
const ComponentContext = require.context('../components', true, /\.vue$/i, 'lazy');

ComponentContext.keys().forEach((componentFilePath) => {
  console.warn(componentFilePath)
  const componentName = componentFilePath.split('/').pop().split('.')[0].toLowerCase();
  Vue.component(componentName, () => ComponentContext(componentFilePath));
});
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
Vue.component('vue-dropzone', vue2Dropzone);
Vue.use(VueRouter)
// Vue.use(VueHighlightJS)
Vue.use(hljs.vuePlugin);
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store/index'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.msgSuccess = function (msg) {
  this.$message({showClose: true, message: msg, type: 'success'})
}

Vue.prototype.msgError = function (msg) {
  this.$message({showClose: true, message: msg, type: 'error'})
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}

Vue.prototype.msgWarning = function (msg) {
  this.$message({showClose: true, message: msg, type: 'warning'})
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  store
})

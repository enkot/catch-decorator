import Vue from 'vue'
import App from './App.vue'
import { ServerError } from './errors'
import catchDecorator from '../../src/index'

Vue.config.productionTip = false

catchDecorator.set(ServerError, (e: any, ctx: any) => {
    ctx.errorMessage = `${e.name}: ${e.message}`
})
catchDecorator.set(Error, (e: any, ctx: any) => {
    ctx.errorMessage = `${e.name}: ${e.message}2`
})

new Vue({
    render: h => h(App),
}).$mount('#app')

const Vue = require('vue');

console.log(Vue)

// externalize Vue - this is not the Vue instance but the class
window.Vue = Vue

export default Vue

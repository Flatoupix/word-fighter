import Vue from 'vue'
import Vuetify from 'vuetify/lib'

// Vue.config.productionTip = false
Vue.use(Vuetify)

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#8c1eff',
        secondary: '#ff901f',
        accent: '#ffd319',
        error: '#ff2975',
        info: '#f222ff',
        success: '#4CAF50',
        warning: '#FFC107',
      },
      dark: {
        primary: '#bb1515',
        secondary: '#757575',
      },
    },
  },
})

export default vuetify

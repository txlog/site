import DefaultTheme from 'vitepress/theme'
import './custom.css'
import ServerVersionBadge from './components/ServerVersionBadge.vue'
import AgentVersionBadge from './components/AgentVersionBadge.vue'
import TxlogHome from './components/TxlogHome.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ServerVersionBadge', ServerVersionBadge)
    app.component('AgentVersionBadge', AgentVersionBadge)
    app.component('TxlogHome', TxlogHome)
  }
}

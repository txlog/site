import DefaultTheme from 'vitepress/theme'
import ServerVersionBadge from './components/ServerVersionBadge.vue'
import AgentVersionBadge from './components/AgentVersionBadge.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('ServerVersionBadge', ServerVersionBadge)
    app.component('AgentVersionBadge', AgentVersionBadge)
  }
}
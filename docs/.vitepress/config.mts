import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Transaction Log",
  description: "Transaction Log tracks package transactions on RPM systems, compiling data on the number of updates and installs.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config`
    logo: '/images/logbook.png',

    search: {
      provider: 'local'
    },

    nav: [
      { text: 'Download', link: '/download/' }
    ],

    sidebar: [
      {
        text: 'Agent',
        items: [
          { text: 'Docs', link: '/agent/docs/' }
        ]
      },
      {
        text: 'Server',
        items: [
          { text: 'Docs', link: '/server/docs/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/txlog' }
    ]
  }
})

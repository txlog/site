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
      { text: 'Home', link: '/' },
      { text: 'Quickstart', link: '/docs/' },
      { text: 'Download', link: '/download/' }
    ],

    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Quickstart', link: '/docs/' }
        ]
      },
      {
        text: 'Help',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/txlog' }
    ]
  }
})

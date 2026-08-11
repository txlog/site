import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Transaction Log",
  description: "Transaction Log tracks package transactions on RPM systems, compiling data on the number of updates and installs.",
  cleanUrls: true,
  ignoreDeadLinks: [
    /^http:\/\/localhost/
  ],
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@400;500&display=swap' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config`
    logo: '/images/logbook.png',

    search: {
      provider: 'local'
    },

    outline: { level: [2, 3], label: 'On this page' },

    editLink: {
      pattern: 'https://github.com/txlog/site/edit/main/docs/:path',
      text: 'Edit this page'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Transaction Log · <a href="https://github.com/txlog">github.com/txlog</a>'
    },

    nav: [
      { text: 'Agent', link: '/docs/agent', activeMatch: '/docs/agent' },
      { text: 'Server', link: '/docs/server', activeMatch: '/docs/server' },
      { text: 'Docs', link: '/docs', activeMatch: '/docs$' },
      { component: 'AgentVersionBadge' },
      { component: 'ServerVersionBadge' }
    ],

    // Escopado por caminho: a home (layout: page) não recebe sidebar.
    sidebar: {
      '/docs/': [
      {
        text: 'Agent',
        collapsed: false,
        items: [
          { text: 'Quick Start', link: '/docs/agent' },
          {
            text: 'Tutorials',
            collapsed: false,
            items: [
              { text: 'Getting Started', link: '/docs/agent/tutorials/getting_started' }
            ]
          },
          {
            text: 'How-to',
            collapsed: false,
            items: [
              { text: 'Configure Authentication', link: '/docs/agent/how-to/configure_authentication' },
              { text: 'Run in CI/CD', link: '/docs/agent/how-to/run_in_cicd' },
              { text: 'Secure Configuration', link: '/docs/agent/how-to/secure_configuration' },
              { text: 'Verify Data Integrity', link: '/docs/agent/how-to/verify_data_integrity' }
            ]
          },
          {
            text: 'Reference',
            collapsed: false,
            items: [
              { text: 'CLI Commands', link: '/docs/agent/reference/cli_commands' },
              { text: 'Configuration', link: '/docs/agent/reference/configuration' },
              { text: 'Environment Variables', link: '/docs/agent/reference/environment_variables' }]
          },
          {
            text: 'Explanation',
            collapsed: false,
            items: [
              { text: 'Architecture Overview', link: '/docs/agent/explanation/architecture_overview' },
              { text: 'Data Collection', link: '/docs/agent/explanation/data_collection' },
              { text: 'Data Synchronization', link: '/docs/agent/explanation/data_synchronization' },
              { text: 'Design Choices', link: '/docs/agent/explanation/design_choices' }]
          }
        ]
      },
      {
        text: 'Server',
        collapsed: false,
        items: [
          { text: 'Quick Start', link: '/docs/server' },
          {
            text: 'Tutorials',
            collapsed: false,
            items: [
              { text: 'Setup Development Environment', link: '/docs/server/tutorials/setup-dev-environment' },
              { text: 'Your First API Request', link: '/docs/server/tutorials/first-api-request' },
            ]
          },
          {
            text: 'How-to',
            collapsed: false,
            items: [
              { text: 'Configure Data Retention', link: '/docs/server/how-to/configure-data-retention' },
              { text: 'Configure LDAP Anonymous', link: '/docs/server/how-to/configure-ldap-anonymous' },
              { text: 'Configure LDAP', link: '/docs/server/how-to/configure-ldap' },
              { text: 'Configure OIDC', link: '/docs/server/how-to/configure-oidc' },
              { text: 'Deploy Kubernetes', link: '/docs/server/how-to/deploy-kubernetes' },
              { text: 'Detect Anomalies', link: '/docs/server/how-to/detect-anomalies' },
              { text: 'Discover LDAP Filters', link: '/docs/server/how-to/discover-ldap-filters' },
              { text: 'Manage API Keys', link: '/docs/server/how-to/manage-api-keys' },
              { text: 'Manage OSV Vulnerabilities', link: '/docs/server/how-to/manage-osv-vulnerabilities' },
              { text: 'Search and Filter Assets', link: '/docs/server/how-to/search-and-filter-assets' },
              { text: 'Run Migrations', link: '/docs/server/how-to/run-migrations' },
              { text: 'Run Tests', link: '/docs/server/how-to/run-tests' }
            ]
          },
          {
            text: 'Reference',
            collapsed: false,
            items: [
              { text: 'API Reference', link: '/docs/server/reference/api-reference' },
              { text: 'Database Schema', link: '/docs/server/reference/database-schema' },
              { text: 'Environment Variables', link: '/docs/server/reference/environment-variables' },
              { text: 'LDAP Cheatsheet', link: '/docs/server/reference/ldap-cheatsheet' },
              { text: 'LDAP Error Codes', link: '/docs/server/reference/ldap-error-codes' },
              { text: 'LDAP Filters', link: '/docs/server/reference/ldap-filters' }
            ]
          },
          {
            text: 'Explanation',
            collapsed: false,
            items: [
              { text: 'Architecture', link: '/docs/server/explanation/architecture' },
              { text: 'Data Model', link: '/docs/server/explanation/data-model' },
              { text: 'LDAP Deep Dive', link: '/docs/server/explanation/ldap-deep-dive' },
              { text: 'LDAP Implementation Details', link: '/docs/server/explanation/ldap-implementation-details' },
              { text: 'LDAP Service Account FAQ', link: '/docs/server/explanation/ldap-service-account-faq' },
              { text: 'OSV Integration', link: '/docs/server/explanation/osv-integration' }
            ]
          }
        ]
      }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/txlog' }
    ]
  },
  sitemap: {
    hostname: 'https://txlog.rda.run',
    lastmodDateOnly: false
  }
})

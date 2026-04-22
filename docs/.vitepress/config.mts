import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Transaction Log",
  description: "Transaction Log tracks package transactions on RPM systems, compiling data on the number of updates and installs.",
  cleanUrls: true,
  ignoreDeadLinks: [
    /^http:\/\/localhost/
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config`
    logo: '/images/logbook.png',

    search: {
      provider: 'local'
    },

    nav: [
      { component: 'AgentVersionBadge' },
      { component: 'ServerVersionBadge' }
    ],

    sidebar: [
      {
        text: 'Agent',
        collapsed: true,
        items: [
          { text: 'Quick Start', link: '/docs/agent' },
          {
            text: 'Tutorials',
            collapsed: false,
            items: [
              { text: 'Getting Started', link: '/docs/agent/tutorials/getting_started' },
              { text: 'MCP Getting Started', link: '/docs/agent/tutorials/mcp_getting_started' }
            ]
          },
          {
            text: 'How-to',
            collapsed: true,
            items: [
              { text: 'Configure Authentication', link: '/docs/agent/how-to/configure_authentication' },
              { text: 'Configure MCP SSE', link: '/docs/agent/how-to/configure_mcp_sse' },
              { text: 'Run in CI/CD', link: '/docs/agent/how-to/run_in_cicd' },
              { text: 'Secure Configuration', link: '/docs/agent/how-to/secure_configuration' },
              { text: 'Verify Data Integrity', link: '/docs/agent/how-to/verify_data_integrity' }
            ]
          },
          {
            text: 'Reference',
            collapsed: true,
            items: [
              { text: 'CLI Commands', link: '/docs/agent/reference/cli_commands' },
              { text: 'Configuration', link: '/docs/agent/reference/configuration' },
              { text: 'Environment Variables', link: '/docs/agent/reference/environment_variables' },
              { text: 'MCP Tools', link: '/docs/agent/reference/mcp_tools' }
            ]
          },
          {
            text: 'Explanation',
            collapsed: true,
            items: [
              { text: 'Architecture Overview', link: '/docs/agent/explanation/architecture_overview' },
              { text: 'Data Collection', link: '/docs/agent/explanation/data_collection' },
              { text: 'Data Synchronization', link: '/docs/agent/explanation/data_synchronization' },
              { text: 'Design Choices', link: '/docs/agent/explanation/design_choices' },
              { text: 'MCP Integration', link: '/docs/agent/explanation/mcp_integration' }
            ]
          }
        ]
      },
      {
        text: 'Server',
        collapsed: true,
        items: [
          { text: 'Quick Start', link: '/docs/server' },
          {
            text: 'Tutorials',
            collapsed: false,
            items: [
              { text: 'First API Request', link: '/docs/server/tutorials/first-api-request' },
              { text: 'Getting Started', link: '/docs/server/tutorials/getting-started' }
            ]
          },
          {
            text: 'How-to',
            collapsed: true,
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
              { text: 'Run Migrations', link: '/docs/server/how-to/run-migrations' },
              { text: 'Run Tests', link: '/docs/server/how-to/run-tests' }
            ]
          },
          {
            text: 'Reference',
            collapsed: true,
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
            collapsed: true,
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
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/txlog' }
    ]
  },
  sitemap: {
    hostname: 'https://txlog.rda.run',
    lastmodDateOnly: false
  }
})

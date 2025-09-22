# GitHub Copilot Instructions

## Project Overview
This is a VitePress documentation site located in `/docs` with custom Vue components for interactive features. The site includes email verification functionality and API integrations.

## Architecture & Key Patterns

### VitePress Structure
- Documentation content: `/docs/*.md`
- Theme customization: `/docs/.vitepress/theme/`
- Custom components: `/docs/.vitepress/theme/components/`
- Configuration: `/docs/.vitepress/config.js`

### Vue Component Patterns
Components follow Vue 3 Composition API patterns:
```vue
<script setup>
import { ref } from 'vue'
// Reactive state management with ref()
const submissionStatus = ref('') // '', 'loading', 'success', 'error'
</script>
```

### API Integration Pattern
External API calls use fetch with proper error handling:
- Base URL pattern: `https://ca.rda.run/v1/{email}`
- Response handling checks both HTTP status and response data properties
- UI state management for loading/success/error states
- Form validation with disabled states during API calls

### CSS Conventions
- Use VitePress CSS variables: `var(--vp-c-brand-1)`, `var(--vp-c-bg-soft)`
- Component-scoped styling with semantic class names
- Responsive design with proper spacing (rem units)
- State-based styling classes: `.text-success`, `.text-error`

## Development Workflow

### Local Development
```bash
npm run docs:dev  # Start VitePress dev server
npm run docs:build  # Build for production
```

### Component Development
- Place custom components in `/docs/.vitepress/theme/components/`
- Register components in theme configuration
- Use VitePress design tokens for consistent styling
- Implement proper loading states for async operations

## Key Files
- `/docs/.vitepress/theme/components/ServerVersionBadge.vue` - Example of API integration component
- `/docs/.vitepress/config.js` - Site configuration and theme setup

## Specific Patterns to Follow
- Use `submissionStatus` pattern for form states: `'', 'loading', 'success', 'error'`
- Implement `has-results` CSS class pattern for connected UI sections
- Store API responses in reactive refs for displaying detailed results
- Use proper error boundaries distinguishing network vs API errors
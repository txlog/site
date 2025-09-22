<script setup>
import { ref, onMounted } from 'vue'

const submissionStatus = ref('') // '', 'loading', 'success', 'error'
const versionData = ref(null)

const fetchVersion = async () => {
  submissionStatus.value = 'loading'
  
  try {
    const response = await fetch('https://txlog.rda.run/server/version')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.text()
    versionData.value = data.trim()
    submissionStatus.value = 'success'
  } catch (error) {
    console.error('Error fetching server version:', error)
    submissionStatus.value = 'error'
  }
}

// Fetch version on component mount
onMounted(() => {
  fetchVersion()
})
</script>

<template>
  <div class="version-badge">
    <div class="divider"></div>
    <a 
      href="https://txlog.rda.run/server/latest" 
      target="_blank" 
      rel="noopener noreferrer"
      class="shield-link"
    >
      <div v-if="submissionStatus === 'loading'" class="shield-badge loading">
        <span class="shield-label">...</span>
        <span class="shield-value">...</span>
      </div>
      
      <div v-else-if="submissionStatus === 'success' && versionData" class="shield-badge success">
        <span class="shield-label">server</span>
        <span class="shield-value">{{ versionData }}</span>
      </div>
      
      <div v-else-if="submissionStatus === 'error'" class="shield-badge error">
        <span class="shield-label">server</span>
        <span class="shield-value">version unavailable</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.version-badge {
  display: inline-flex;
  align-items: center;
  /* margin-left: 0 12px; */
}

.divider {
  width: 1px;
  height: 24px;
  background-color: var(--vp-c-divider);
  margin-right: 12px;
}

.shield-link {
  text-decoration: none;
  display: inline-block;
}

.shield-badge {
  display: inline-flex;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}

.shield-label {
  background-color: #5b5e8b;
  color: #fff;
  padding: 0.375rem 0.5rem;
  display: inline-flex;
  align-items: center;
  text-transform: lowercase;
}

.shield-value {
  background-color: #deddff;
  color: #333;
  padding: 0.375rem 0.5rem;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
}

.shield-badge.loading .shield-value {
  background-color: #deddff;
  color: #333;
}

.shield-badge.success .shield-value {
  background-color: #deddff;
  color: #333;
}

.shield-badge.error .shield-value {
  background-color: #deddff;
  color: #333;
}

.shield-link:hover .shield-badge {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style>
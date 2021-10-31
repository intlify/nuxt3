<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const name = ref('Nuxt3')
</script>

<template>
  <div class="container">
    <h1>{{ t('hello', { name }) }}</h1>
  </div>
</template>

<style scoped>
.container {
  margin-top: 1rem;
}
</style>

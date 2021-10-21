<template>
  <div class="container">
    <h1>Hello Nuxt3!</h1>
    <p>{{ t('hello') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <header>
    <NuxtLink to="/">{{ $t('menu.home') }}</NuxtLink>
    |
    <NuxtLink to="/about">{{ $t('menu.about') }}</NuxtLink>
    |
    <form class="language">
      <label for="locale-select">{{ $t('language') }}</label>
      <select id="locale-select" v-model="$i18n.locale">
        <option value="en">en</option>
        <option value="ja">ja</option>
      </select>
    </form>
  </header>
  <main>
    <slot></slot>
  </main>
</template>

<style scoped>
.language {
  display: inline-block;
}
</style>

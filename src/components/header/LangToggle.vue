<script setup lang="ts">
import { SUPPORTED_LANGS, setLanguage } from '@/utils/i18n'
import { TranslationOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
</script>

<template>
  <a-dropdown>
    <a-button
      class="btn-has-icon"
      type="text"
      style="color: var(--app-header-text-color) !important"
      :icon="h(TranslationOutlined)"
      @click.prevent
    />
    <template #overlay>
      <a-menu
        :items="
          SUPPORTED_LANGS.map((v) => ({
            key: v.value,
            label: v.label
          }))
        "
        @click="({ key }: { key: string }) => setLanguage(key, false)"
      />
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import err403 from '@/assets/403 Forbidden.png'
import { t } from '@/utils/i18n'
import { HomeOutlined } from '@ant-design/icons-vue'
</script>
<template>
  <div class="mx-auto w-1/2 text-center">
    <img alt="403 Forbidden" title="403 Forbidden" :src="err403" />
    <a-button class="btn-has-icon" href="/" type="primary" size="large">
      {{ t('TXT_CODE_70e0cf4d') }}
      <HomeOutlined />
    </a-button>
  </div>
</template>

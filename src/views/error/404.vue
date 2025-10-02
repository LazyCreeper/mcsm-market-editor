<script setup lang="ts">
import err404 from '@/assets/404 NotFound.png'
import { t } from '@/utils/i18n'
import { HomeOutlined } from '@ant-design/icons-vue'
</script>
<template>
  <div class="mx-auto w-1/2 text-center">
    <img alt="404 Not Found" title="404 Not Found" :src="err404" />
    <a-button class="btn-has-icon" href="/" type="primary" size="large">
      {{ t('TXT_CODE_70e0cf4d') }}
      <HomeOutlined />
    </a-button>
  </div>
</template>

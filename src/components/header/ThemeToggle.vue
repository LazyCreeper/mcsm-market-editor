<script setup lang="ts">
import { h } from 'vue'
import {
  BgColorsOutlined,
  BulbOutlined,
  RetweetOutlined,
  YuqueOutlined
} from '@ant-design/icons-vue'
import { type MenuProps } from 'ant-design-vue'
import { setTheme } from '@/plugins/theme'
import { AppTheme } from '@/types'

const items = ref<MenuProps['items']>([
  {
    key: AppTheme.AUTO,
    icon: () => h(RetweetOutlined),
    label: '自动',
    onClick: () => setTheme(AppTheme.AUTO)
  },
  {
    key: AppTheme.LIGHT,
    icon: () => h(BulbOutlined),
    label: '亮色',
    onClick: () => setTheme(AppTheme.LIGHT)
  },
  {
    key: AppTheme.DARK,
    icon: () => h(YuqueOutlined),
    label: '暗色',
    onClick: () => setTheme(AppTheme.DARK)
  }
])
</script>

<template>
  <a-dropdown>
    <a-button
      class="btn-has-icon"
      type="text"
      style="color: var(--app-header-text-color) !important"
      :icon="h(BgColorsOutlined)"
      @click.prevent
    />
    <template #overlay>
      <a-menu :items />
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import type { Settings } from '@/types'
import { t } from '@/utils/i18n'
import { SettingOutlined } from '@ant-design/icons-vue'
import { useLocalStorage } from '@vueuse/core'
import { message, type FormInstance } from 'ant-design-vue'
import { h } from 'vue'

const status = ref(false),
  loading = ref(false),
  formRef = ref<FormInstance>(),
  formData = ref<Settings>({
    bg: ''
  }),
  currentSettings = useLocalStorage<Settings>('0_检测到特殊条件，开启远程人偶自动赞美模式！', {
    bg: ''
  }),
  open = () => {
    formData.value = { ...currentSettings.value }
    status.value = true
  },
  cancel = () => {
    status.value = false
  },
  ok = async () => {
    try {
      loading.value = true
      await formRef.value?.validate()
      currentSettings.value = { ...formData.value }
      message.success(t('保存成功'))
      cancel()
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <a-button
    class="btn-has-icon"
    type="text"
    style="color: var(--app-header-text-color) !important"
    :icon="h(SettingOutlined)"
    @click="open"
  />
  <a-modal
    v-model:open="status"
    centered
    class="min-w-[50svw]"
    :title="t('设置')"
    :mask-closable="false"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form v-if="formData" ref="formRef" :model="formData" layout="vertical">
      <a-form-item :label="t('网站背景图')" name="bg">
        <a-input v-model:value="formData.bg" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

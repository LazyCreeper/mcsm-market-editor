<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/utils/i18n'
import type { QuickStartPackages } from '@/types'
import { message, type FormInstance } from 'ant-design-vue'
import _ from 'lodash'

const status = ref(false),
  title = ref(''),
  loading = ref(false),
  editMode = ref<boolean>(true),
  formRef = ref<FormInstance>(),
  formData = ref<Partial<QuickStartPackages>>({}),
  emits = defineEmits(['ok']),
  open = (i?: QuickStartPackages) => {
    if (i) {
      formData.value = _.cloneDeep(i)
      editMode.value = true
    } else {
      editMode.value = false
    }
    title.value = editMode.value ? t('编辑模板') : t('新增模板')
    status.value = true
  },
  cancel = () => {
    status.value = false
    formRef.value?.resetFields()
    formData.value = {}
  },
  ok = async () => {
    try {
      loading.value = true
      await formRef.value?.validate()

      message.success(editMode.value ? t('保存成功') : t('创建成功'))
      emits('ok', formData.value)
      cancel()
    } finally {
      loading.value = false
    }
  }

defineExpose({
  open
})
</script>

<template>
  <a-modal v-model:open="status" centered :title @ok="ok" @cancel="cancel">
    <a-form ref="formRef" :model="formData" layout="vertical">
      <a-form-item :label="t('模板名称')" name="title">
        <a-input v-model:value="formData.title" />
      </a-form-item>
      <a-form-item :label="t('语言')" name="language">
        <a-input v-model:value="formData.language" />
      </a-form-item>
      <a-form-item :label="t('运行平台')" name="platform">
        <a-input v-model:value="formData.platform" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

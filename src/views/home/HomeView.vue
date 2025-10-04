<script setup lang="ts">
import { h } from 'vue'
import { t } from '@/utils/i18n'
import { SlackOutlined, InboxOutlined, NumberOutlined } from '@ant-design/icons-vue'
import { message, type UploadProps } from 'ant-design-vue'
import _router from '@/router'
import { md } from '@/hooks/useResponsive'
import { indexStore } from '@/stores'
import sticker from '@/assets/sticker.jpg'

const { userUploadData } = indexStore()
const templateUrl = ref('https://script.mcsmanager.com/market.json')

const router = {
  go: (query: { url?: string; userUpload?: string; newTemplate?: string }) => {
    _router.push({
      path: '/app/editor',
      query
    })
  }
}
const handleSubmit = () => {
  if (!templateUrl.value) return message.error(t('TXT_CODE_ac10fe01'))
  router.go({
    url: templateUrl.value
  })
}

const fileList = ref<any>([])
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const reader = new FileReader()

  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target || !e.target.result) return message.error(t('TXT_CODE_a62886b9'))
    if (typeof e.target.result !== 'string') return message.error(t('TXT_CODE_bddc37e2'))
    const fileContent = e.target.result
    try {
      const jsonData = JSON.parse(fileContent)
      userUploadData.value = jsonData
      router.go({
        userUpload: 'true'
      })
    } catch {
      message.error(t('TXT_CODE_bddc37e2'))
    }
  }
  reader.onerror = () => message.error(t('TXT_CODE_a62886b9'))
  reader.readAsText(file)
  return false
}
</script>

<template>
  <!-- class="h-[calc(100svh-180px)]" -->

  <a-row class="py-16" align="middle" justify="center" :gutter="20">
    <a-col :span="24" :lg="16">
      <div class="text-center">
        <h1 class="text-[2.5rem] font-medium sm:text-[4rem] lg:text-[5rem]">
          MCSManager
          <span class="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">
            M<i>T</i><b>E</b>
          </span>
        </h1>
        <p class="mt-4 mb-8 text-base sm:text-lg lg:text-xl">
          {{ t('TXT_CODE_1f190ead', ['10.8.7']) }}
        </p>
        <a-form
          layout="horizontal"
          class="max-w-[50svw]"
          style="margin: auto"
          @submit="handleSubmit"
        >
          <a-row :gutter="20">
            <a-col :span="24" :lg="14">
              <a-form-item>
                <a-input v-model:value="templateUrl" :placeholder="t('TXT_CODE_ac10fe01')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :lg="5">
              <a-form-item>
                <a-button
                  class="btn-has-icon w-full"
                  type="primary"
                  size="large"
                  @click="handleSubmit"
                  :icon="h(SlackOutlined)"
                >
                  {{ t('TXT_CODE_5ead1240') }}
                </a-button>
              </a-form-item>
            </a-col>
            <a-col :span="24" :lg="5">
              <a-form-item>
                <a-button
                  class="btn-has-icon button-color-success w-full"
                  size="large"
                  @click="
                    router.go({
                      newTemplate: 'true'
                    })
                  "
                  :icon="h(NumberOutlined)"
                >
                  {{ t('TXT_CODE_595efd06') }}
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <a-upload-dragger
          v-model:fileList="fileList"
          class="m-auto max-w-[50svw]"
          accept=".json"
          :maxCount="1"
          :before-upload="beforeUpload"
          :showUploadList="false"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined></inbox-outlined>
          </p>
          <p class="ant-upload-text">{{ t('TXT_CODE_8e16ee21') }}</p>
          <p class="ant-upload-hint">
            {{ t('TXT_CODE_e1c60611') }}
          </p>
        </a-upload-dragger>
      </div>
    </a-col>
    <a-col v-if="!md" :span="24" :lg="8">
      <img class="m-auto shadow-lg/30 shadow-black" :src="sticker" alt="" />
    </a-col>
  </a-row>
</template>

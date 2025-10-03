<script setup lang="ts">
import { h } from 'vue'
import { t } from '@/utils/i18n'
import { QuestionCircleOutlined, SlackOutlined, InboxOutlined } from '@ant-design/icons-vue'
import { message, type UploadProps } from 'ant-design-vue'
import router from '@/router'
import { md } from '@/hooks/useResponsive'
import { indexStore } from '@/stores'

const { userUploadData } = indexStore()
const templateUrl = ref('https://script.mcsmanager.com/market.json')

const handleSubmit = () => {
  if (!templateUrl.value) return message.error(t('TXT_CODE_ac10fe01'))
  router.push({
    path: '/app/editor',
    query: {
      url: templateUrl.value
    }
  })
}

const fileList = ref<any>([])
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const reader = new FileReader()

  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target || !e.target.result) return message.error(t('文件读取失败'))
    if (typeof e.target.result !== 'string')
      return message.error(t('文件解析失败，请确保是有效的JSON文件'))
    const fileContent = e.target.result
    try {
      const jsonData = JSON.parse(fileContent)
      userUploadData.value = jsonData
      router.push({
        path: '/app/editor',
        query: {
          userUpload: 'true'
        }
      })
    } catch {
      message.error(t('文件解析失败，请确保是有效的JSON文件'))
    }
  }
  reader.onerror = () => message.error(t('文件读取失败'))
  reader.readAsText(file)
  return false
}
</script>

<template>
  <!-- class="h-[calc(100svh-180px)]" -->

  <a-row class="py-16" align="middle" justify="center">
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
          <a-row :gutter="25">
            <a-col :span="24" :lg="16">
              <a-form-item>
                <a-input v-model:value="templateUrl" :placeholder="t('TXT_CODE_ac10fe01')" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :lg="8">
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
          </a-row>
        </a-form>
      </div>
    </a-col>
    <a-col v-if="!md" :span="24" :lg="8">
      <div class="w-100 text-center text-sky-400">
        <QuestionCircleOutlined
          class="drop-shadow-lg drop-shadow-sky-600"
          style="font-size: 20rem"
        />
      </div>
    </a-col>
  </a-row>

  <a-upload-dragger
    v-model:fileList="fileList"
    accept=".json"
    :maxCount="1"
    :before-upload="beforeUpload"
    :showUploadList="false"
  >
    <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <p class="ant-upload-text">Click or drag file to this area to upload</p>
    <p class="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
  </a-upload-dragger>
</template>

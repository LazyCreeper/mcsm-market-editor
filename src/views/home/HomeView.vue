<script setup lang="ts">
import { h } from 'vue'
import { t } from '@/utils/i18n'
import { CreditCardOutlined, SlackOutlined } from '@ant-design/icons-vue'
const templateUrl = ref('https://script.mcsmanager.com/market.json')

const handleSubmit = () => {
  if (!templateUrl.value) {
    return
  }
}
</script>

<template>
  <a-row class="py-8" align="middle" justify="center">
    <a-col :span="16">
      <div class="text-center">
        <h1 class="text-[5rem] font-medium">
          MCSManager
          <span class="bg-gradient-to-r from-sky-400 to-pink-400 bg-clip-text text-transparent">
            M<i>T</i><b>E</b>
          </span>
        </h1>
        <p class="mt-4 mb-8 text-xl">
          {{ t('适用于 MCSManager 10 的应用市场模板编辑器') }}
        </p>
        <a-form layout="inline" class="justify-center">
          <a-form-item>
            <a-input
              v-model:value="templateUrl"
              :placeholder="t('请输入模板地址')"
              style="width: 320px"
            />
          </a-form-item>
          <a-form-item>
            <a-button
              class="btn-has-icon"
              type="primary"
              size="large"
              @click="handleSubmit"
              :icon="h(SlackOutlined)"
            >
              {{ t('开始编辑') }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-col>
    <a-col :span="8">
      <div class="w-100 text-center text-sky-400">
        <CreditCardOutlined class="drop-shadow-lg drop-shadow-sky-600" style="font-size: 20rem" />
      </div>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { theme } from './plugins/theme'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { indexStore } from './stores'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import AppHeader from '@/components/header/index.vue'

const { progressLinear } = indexStore()

// const collapsed = ref({
//   status: false,
//   width: 240
// })

// const toggleCollapsed = () => {
//   collapsed.value.status = !collapsed.value.status
//   if (!isPhone.value) collapsed.value.width = collapsed.value.status ? 0 : 240
// }

onMounted(() => {
  dayjs.locale('zh-cn')
})

// watchEffect(() => {
//   collapsed.value.status = isPhone.value ? true : false
//   collapsed.value.width = isPhone.value ? 0 : 240
// })
</script>

<template>
  <a-progress
    v-if="progressLinear.num"
    :size="3"
    :stroke-color="{
      '0%': 'transparent',
      '100%': progressLinear.color.current
    }"
    :percent="progressLinear.num"
    :showInfo="false"
    class="fixed -top-[11px] z-50"
  />
  <ConfigProvider :locale="zhCN" :theme>
    <a-layout class="transition-all duration-300">
      <AppHeader />

      <a-layout-content disabled :style="{ overflow: 'initial' }">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <div :key="$route.name">
              <a-spin
                :indicator="
                  h(LoadingOutlined, {
                    style: {
                      fontSize: '48px'
                    }
                  })
                "
                :spinning="progressLinear.num > 0"
              >
                <component :is="Component" />
              </a-spin>
            </div>
          </Transition>
        </RouterView>
      </a-layout-content>
    </a-layout>
  </ConfigProvider>
</template>


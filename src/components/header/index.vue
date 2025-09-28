<script setup lang="ts">
import router from '@/router'
import ThemeToggle from './ThemeToggle.vue'
// import { indexStore } from '@/stores'
import { useScroll } from '@vueuse/core'
import { isPhone } from '@/hooks/useResponsive'
import logo from '@/assets/logo.png'
import LangToggle from './LangToggle.vue'
import { t } from '@/utils/i18n'

// const props = defineProps<{
//   collapsed: {
//     status?: boolean
//     width?: number
//   }
// }>()

// const { isLogin } = indexStore()

const { y } = useScroll(document.body)
const isScroll = computed(() => {
  return y.value > 10
})

const headerStyle = computed(() => {
  return {
    '--header-height': isScroll.value ? '60px' : '64px'
  }
})

const menus = computed(() => {
  return router
    .getRoutes()
    .filter((v) => {
      if (v.path === '/' || !v.name) return false
      const metaInfo = v.meta as any
      if (metaInfo.condition && !metaInfo.condition()) {
        return false
      }

      return metaInfo.mainMenu === true
    })
    .map((r) => {
      return {
        name: r.name,
        path: r.path,
        meta: r.meta,
        customClass: r.meta.customClass ?? []
      }
    })
})
</script>

<template>
  <header class="app-header-wrapper" :style="headerStyle">
    <div v-if="!isPhone" class="app-header-content">
      <nav class="btns">
        <a href="." class="mr-[12px] h-[18px]">
          <img class="logo h-[18px]" :src="logo" />
        </a>

        <div class="nav-button" @click="$router.push('/')">
          <!-- <span>{{ router.currentRoute.value.name }}</span> -->
          <span>{{ t('首页') }}</span>
        </div>

        <div
          v-for="item in menus"
          :key="item.path"
          class="nav-button"
          :class="item.customClass"
          @click="$router.push(item.path)"
        >
          <span>{{ item.name }}</span>
        </div>
      </nav>

      <div class="btns gap-[4px]">
        <ThemeToggle />
        <LangToggle />
      </div>
    </div>
  </header>

  <div v-if="!isPhone" style="height: 64px"></div>

  <!-- TODO: 手机端按钮 -->
</template>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';

.app-header-wrapper {
  box-shadow: 0 2px 4px 0 var(--card-shadow-color);

  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--app-header-bg);
  backdrop-filter: saturate(180%) blur(20px);
  color: var(--app-header-text-color);

  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  z-index: 20;

  // 添加平滑过渡效果
  transition: height 0.4s ease-in-out;

  .app-header-content {
    @extend .global-app-container !optional;

    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: var(--header-height);

    // 添加平滑过渡效果
    transition: height 0.4s ease-in-out;

    .btns {
      display: flex;
      align-items: center;
    }
  }

  .nav-button {
    margin: 0 4px;
    font-size: 14px;
    transition: all 0.4s;
    color: var(--app-header-text-color) !important;
    text-align: center;
    padding: 8px 12px;
    min-width: 40px;
    cursor: pointer;
    border-radius: 6px;
    user-select: none;
  }

  .right-nav-button {
    margin: 0 2px;
    font-size: 14px;
    padding: 8px 8px;
  }

  .icon-button {
    font-size: 16px !important;
  }
  .nav-button:hover {
    background-color: rgba(215, 215, 215, 0.261);
  }

  .logo {
    cursor: pointer;
  }

  .pro-mode-order-container {
    @extend .nav-button !optional;
    @extend .nav-button-success !optional;
  }

  // Sync margin
  @media (max-width: 1470px) {
    .app-header-content,
    .app-header-content-for-phone {
      margin: 0px 25px;
    }
  }

  @media (max-width: 992px) {
    .app-header-content {
      margin: 0px 8px;
    }
  }
}
</style>


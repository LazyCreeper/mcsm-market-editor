<script setup lang="ts">
import { h } from 'vue'
import CardPanel from '@/components/CardPanel.vue'
import type { QuickStartPackages, QuickStartTemplate } from '@/types'
import { isCN, t } from '@/utils/i18n'
import {
  CopyOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons-vue'
import { useRouteQuery } from '@vueuse/router'
import { message } from 'ant-design-vue'
import { toCopy } from '@/utils'
import Editor from './dialogs/Editor.vue'
import _ from 'lodash'

const url = useRouteQuery('url', '', { transform: String })

const appList = ref<QuickStartTemplate>()
const appListLoading = ref(false)
const fetchTemplate = async () => {
  if (!url.value) return

  try {
    appListLoading.value = true
    const { data } = await axios.get(url.value)
    appList.value = data
  } catch (error) {
    message.error(t('获取模板失败') + `${error}`)
  } finally {
    appListLoading.value = false
  }
}

const SEARCH_ALL_KEY = 'ALL'
const searchForm = reactive({
  language: isCN() ? 'zh_cn' : 'en_us',
  category: SEARCH_ALL_KEY,
  gameType: SEARCH_ALL_KEY,
  platform: SEARCH_ALL_KEY
})

interface FilterOption {
  label: string
  value: string
}

const matchesFilterCondition = (
  item: QuickStartPackages,
  field: keyof QuickStartPackages,
  filterValue: string
): boolean => {
  return filterValue === SEARCH_ALL_KEY || item[field] === filterValue
}

const matchesLanguageFilter = (item: QuickStartPackages): boolean => {
  return matchesFilterCondition(item, 'language', searchForm.language)
}

const matchesGameTypeFilter = (item: QuickStartPackages): boolean => {
  return matchesFilterCondition(item, 'gameType', searchForm.gameType)
}

const matchesCategoryFilter = (item: QuickStartPackages): boolean => {
  return matchesFilterCondition(item, 'category', searchForm.category)
}

const matchesPlatformFilter = (item: QuickStartPackages): boolean => {
  return matchesFilterCondition(item, 'platform', searchForm.platform)
}

const getFilteredPackages = (
  // eslint-disable-next-line no-unused-vars
  additionalFilters?: (item: QuickStartPackages) => boolean
): QuickStartPackages[] => {
  if (!appList.value?.packages) {
    return []
  }

  return appList.value.packages.filter((item) => {
    // if (props.onlyDockerTemplate && !item.setupInfo?.docker) {
    //   return false;
    // }

    // Apply base filters (language, game type, category, platform)
    const baseFilters = [
      matchesLanguageFilter(item),
      matchesGameTypeFilter(item),
      matchesCategoryFilter(item),
      matchesPlatformFilter(item)
    ]

    // Combine base filters with additional custom filters if provided
    const allFilters = additionalFilters ? [additionalFilters(item)] : baseFilters
    return allFilters.every((filter) => filter)
  })
}

const getSummaryPackages = (
  // eslint-disable-next-line no-unused-vars
  additionalFilters?: (item: QuickStartPackages) => boolean
): QuickStartPackages[] => {
  let filteredPackages = getFilteredPackages(additionalFilters)
  if (searchForm.gameType == SEARCH_ALL_KEY) {
    const map = new Map<string, QuickStartPackages>()
    filteredPackages.forEach((item) => {
      if (!map.has(item.gameType)) {
        const summary: QuickStartPackages = {
          ...item,
          description: '',
          title: item.gameType,
          category: '',
          runtime: '',
          size: '',
          hardware: '',
          remark: '',
          targetLink: undefined,
          author: '',
          setupInfo: undefined,
          tags: undefined,
          isSummary: true
        }
        map.set(item.gameType, summary)
      } else {
        const existing = map.get(item.gameType)
        if (existing) {
          if (existing.platform != item.platform) {
            existing.platform = 'All'
          }
        }
      }
    })
    filteredPackages = Array.from(map.values())
  }
  return filteredPackages
}

const generateOptionsList = (
  items: QuickStartPackages[],
  field: keyof QuickStartPackages,
  allLabel: string,
  // eslint-disable-next-line no-unused-vars
  additionalFilter?: (item: QuickStartPackages) => boolean
): FilterOption[] => {
  const valueMap: Record<string, string> = {}

  // Apply additional filter if provided, otherwise use all items
  const filteredItems = additionalFilter ? items.filter(additionalFilter) : items

  // Build unique value map from filtered items
  filteredItems.forEach((item) => {
    const value = item[field] as string
    if (!valueMap[value]) {
      valueMap[value] = value
    }
  })

  // Add "ALL" option to the map
  valueMap[SEARCH_ALL_KEY] = allLabel

  // Convert map to array of FilterOption objects
  return Object.keys(valueMap).map((key) => ({
    label: valueMap[key] || '',
    value: key
  }))
}

const dynamicList = computed(() => getSummaryPackages())

const appLangList = computed(() => {
  const languageOptions: FilterOption[] =
    appList.value?.languages instanceof Array ? appList.value.languages : []

  return [...languageOptions]
})

const appGameTypeList = computed(() => {
  const packages = getFilteredPackages(matchesLanguageFilter)
  return generateOptionsList(packages, 'gameType', t('所有游戏'))
})

const appCategoryList = computed(() => {
  const packages = getFilteredPackages(
    (item) => matchesLanguageFilter(item) && matchesGameTypeFilter(item)
  )
  return generateOptionsList(packages, 'category', t('所有版本'))
})

const appPlatformList = computed(() => {
  const packages = getFilteredPackages(
    (item) => matchesLanguageFilter(item) && matchesGameTypeFilter(item)
  )
  return generateOptionsList(packages, 'platform', t('所有系统'))
})

const handleReset = () => {
  searchForm.language = isCN() ? 'zh_cn' : 'en_us'
  searchForm.gameType = SEARCH_ALL_KEY
  searchForm.category = SEARCH_ALL_KEY
  searchForm.platform = SEARCH_ALL_KEY
}

const handleGameTypeChange = () => {
  searchForm.category = SEARCH_ALL_KEY
  searchForm.platform = SEARCH_ALL_KEY
}

const handleLanguageChange = () => {
  searchForm.gameType = SEARCH_ALL_KEY
  searchForm.category = SEARCH_ALL_KEY
  searchForm.platform = SEARCH_ALL_KEY
}

const handlePlatformChange = () => {
  searchForm.category = SEARCH_ALL_KEY
}

const checkRaw = () => window.open(url.value)

const downloadMarketJson = () => {
  if (!appList.value) return message.warning(t('暂无数据可下载'))
  const dataStr = JSON.stringify(appList.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'market.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  message.success(t('已开始下载...'))
}

const editorRef = ref<InstanceType<typeof Editor>>()
const rawItem = ref<QuickStartPackages>()
const toEdit = (item: QuickStartPackages) => {
  rawItem.value = item
  const actualIndex = appList.value?.packages.findIndex(
    (pkg) =>
      pkg.targetLink === rawItem.value?.targetLink &&
      pkg.title === rawItem.value?.title &&
      pkg.gameType === rawItem.value?.gameType &&
      pkg.language === rawItem.value?.language &&
      pkg.category === rawItem.value?.category
  )
  editorRef?.value?.open(item, actualIndex)
}

const save = (item: QuickStartPackages, i: number) => {
  if (!appList.value?.packages) return
  // 如果 i < 0 表示新
  if (i < 0) {
    appList.value.packages.push(item)
  } else {
    appList.value.packages[i] = item
  }
}

onMounted(() => {
  fetchTemplate()
})

// TODO: 根据本地存储的ID获取
// const id = useRouteQuery('id')
</script>

<template>
  <div class="my-8"></div>
  <a-typography-title :level="3" style="margin-bottom: 8px">
    <EditOutlined />
    {{ t('编辑器选项 & 说明') }}
  </a-typography-title>
  <a-typography-paragraph>
    <div>
      <p>
        <span>{{ t('您可以通过鼠标拖拽来实现排序，也可以通过点击模板进行信息编辑。') }}</span>
      </p>
    </div>
  </a-typography-paragraph>
  <a-form layout="horizontal" :model="searchForm" class="flex flex-wrap justify-between">
    <div class="flex flex-wrap gap-4">
      <a-form-item class="mb-0">
        <a-button class="btn-has-icon" type="primary" size="large">
          {{ t('保存更改到浏览器') }}
          <SaveOutlined />
        </a-button>
      </a-form-item>

      <a-form-item class="mb-0">
        <a-button
          class="button-color-success btn-has-icon"
          size="large"
          @click="downloadMarketJson"
        >
          {{ t('下载修改后的文件') }}
          <DownloadOutlined />
        </a-button>
      </a-form-item>

      <a-form-item class="mb-0">
        <a-button class="btn-has-icon" type="default" size="large" @click="checkRaw">
          {{ t('查看原始文件') }}
          <FileTextOutlined />
        </a-button>
      </a-form-item>

      <a-form-item class="mb-0">
        <a-button
          class="btn-has-icon"
          type="dashed"
          size="large"
          @click="toCopy(JSON.stringify(appList))"
        >
          {{ t('复制模板到剪切板') }}
          <CopyOutlined />
        </a-button>
      </a-form-item>
    </div>

    <div class="flex flex-wrap gap-4">
      <a-form-item class="mb-0">
        <a-button class="btn-has-icon" type="default" size="large">
          {{ t('批量操作') }}
        </a-button>
      </a-form-item>

      <a-form-item class="mb-0">
        <a-button class="button-color-success btn-has-icon" size="large" @click="editorRef?.open()">
          {{ t('新增模板') }}
          <PlusOutlined />
        </a-button>
      </a-form-item>
    </div>
  </a-form>

  <a-typography-title :level="3" style="margin-bottom: 8px">
    <DatabaseOutlined />
    {{ t('模板市场') }}
  </a-typography-title>
  <a-typography-paragraph>
    <div>
      <p>
        <span>{{
          t('您可以通过下拉框筛选游戏，选择模板并进行安装，请确保系统已安装游戏需要的运行时环境。')
        }}</span>
        <!-- <span v-if="onlyDockerTemplate">
          <br />
          {{ t("由于实例类型为 Docker 容器模式，我们将只展示 Docker 版的模板。") }}
          <br />
        </span> -->
      </p>
    </div>
  </a-typography-paragraph>

  <a-row v-if="appListLoading" :gutter="[24, 24]" style="height: 100%">
    <a-col :span="24">
      <div
        style="
          height: 50vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        "
      >
        <div>
          <a-spin
            :indicator="
              h(LoadingOutlined, {
                style: {
                  fontSize: '24px'
                },
                spin: true
              })
            "
          />
        </div>
        <div style="margin-top: 20px; color: var(--color-gray-12)">
          {{ t('加载中，如果长期无反应，请检查网络。') }}
        </div>
      </div>
    </a-col>
  </a-row>
  <a-row v-else :gutter="[12, 12]" style="height: 100%">
    <!-- Search filters section -->
    <a-col :span="24" :md="24">
      <a-form
        layout="horizontal"
        :model="searchForm"
        style="display: flex; gap: 10px; flex-wrap: wrap"
      >
        <!-- Language filter dropdown -->
        <a-form-item class="mb-0">
          <a-select
            v-model:value="searchForm.language"
            style="width: 200px"
            :placeholder="t('所有语言')"
            @change="handleLanguageChange"
          >
            <a-select-option v-for="item in appLangList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Game type filter dropdown -->
        <a-form-item class="mb-0">
          <a-select
            v-model:value="searchForm.gameType"
            style="width: 200px"
            :placeholder="t('所有游戏')"
            @change="handleGameTypeChange"
          >
            <a-select-option v-for="item in appGameTypeList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Platform filter dropdown -->
        <a-form-item class="mb-0">
          <a-select
            v-model:value="searchForm.platform"
            style="width: 200px"
            :placeholder="t('所有系统')"
            @change="handlePlatformChange"
          >
            <a-select-option v-for="item in appPlatformList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- Category filter dropdown -->
        <a-form-item class="mb-0">
          <a-select
            v-model:value="searchForm.category"
            style="width: 200px"
            :placeholder="t('所有类别')"
          >
            <a-select-option v-for="item in appCategoryList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item class="mb-0">
          <a-button type="default" size="large" @click="handleReset">
            {{ t('重置所有筛选条件') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>

    <!-- Empty state - shown when no packages match current filters -->
    <a-col v-if="dynamicList.length === 0" :span="24">
      <div style="display: flex; justify-content: center; align-items: center; height: 40vh">
        <a-typography-paragraph :style="{ color: 'var(--color-gray-7)' }">
          {{ t('无可用模板') }}
        </a-typography-paragraph>
      </div>
    </a-col>

    <!-- Package cards grid with fade-up animation -->
    <a-col
      v-for="item in dynamicList"
      :key="item.targetLink + item.title + item.gameType + item.language + item.category"
      :span="24"
      :xl="6"
      :lg="6"
      :md="12"
      :sm="24"
    >
      <!-- Individual package card -->
      <div style="display: flex; flex-grow: 1; flex-direction: column; height: 100%">
        <CardPanel style="flex-grow: 1" :style="{ padding: '12px' }" :full-height="!item.isSummary">
          <!-- Package content -->
          <template #body>
            <div class="package-card-content">
              <div class="package-image-container">
                <img class="package-image cursor-pointer" :src="item.image" alt="" srcset="" />
              </div>

              <div class="package-info">
                <a-typography-title :level="5" class="flex justify-between">
                  <span>
                    {{ item.title }}
                  </span>
                  <span>
                    <a-tag v-if="item.platform" color="cyan">
                      {{
                        String(item.platform).toLowerCase() === 'all'
                          ? t('所有平台')
                          : item.platform
                      }}
                    </a-tag>
                  </span>
                </a-typography-title>
                <div v-if="!item.isSummary" class="mb-5">
                  <a-tag v-for="tag in item.tags" :key="tag" color="blue">{{ tag }}</a-tag>
                </div>
                <a-typography-paragraph v-if="!item.isSummary">
                  <a-typography-text :style="{ fontSize: '12px' }">
                    <p>
                      <span>
                        {{ item.description || '&nbsp;' }}
                      </span>
                    </p>
                    <p v-if="item.runtime">
                      <span style="opacity: 0.6">{{ t('环境需求') }}: </span>
                      <span>{{ item.runtime }}</span>
                    </p>
                    <p v-if="item.hardware">
                      <span style="opacity: 0.6">{{ t('硬件要求') }}: </span>
                      <span>{{ item.hardware }}</span>
                    </p>
                  </a-typography-text>
                </a-typography-paragraph>
              </div>

              <div class="package-action">
                <a-button
                  v-if="!item.isSummary"
                  block
                  type="primary"
                  size="large"
                  class="download-button btn-has-icon"
                  @click="toEdit(item)"
                >
                  <!-- 要获取原来在applist里面的 i,而不是筛选过后的i -->
                  <template #icon>
                    <DownloadOutlined />
                  </template>
                  {{ t('安装') }}
                </a-button>

                <a-button
                  v-else
                  block
                  type="primary"
                  size="large"
                  class="download-button btn-has-icon"
                  @click="searchForm.gameType = item.gameType"
                >
                  {{ t('查看') }}
                </a-button>
              </div>
            </div>
          </template>
        </CardPanel>
      </div>
    </a-col>
  </a-row>

  <Editor
    ref="editorRef"
    @ok="save"
    :gL="appGameTypeList"
    :pL="appPlatformList"
    :cL="appCategoryList"
  />
</template>

<style scoped>
.package-card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  height: 100%;
  transition: all 0.3s ease;
}

.package-image-container {
  overflow: hidden;
  border-radius: 8px;
}

.package-image {
  height: 100%;
  width: 100%;
  object-fit: cover;
  max-height: 160px;
  height: 160px;
  transition: transform 0.3s ease;
}

.package-info {
  flex: 1;
}

.package-action {
  display: flex;
  justify-content: center;
}

.download-button {
  margin: 0px auto;
  transition: all 0.3s ease;
}

.package-image {
  user-drag: none;
  user-select: none;
  position: relative;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.package-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(24, 144, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.package-image:hover {
  transform: scale(1.08) rotate(2deg);
  filter: brightness(1.1) contrast(1.1);
}

.package-image:hover::after {
  opacity: 1;
}

.ant-card:hover .download-button {
  transform: scale(1.08);
  box-shadow:
    0 8px 20px rgba(24, 144, 255, 0.4),
    0 0 15px rgba(24, 144, 255, 0.2);
  background: linear-gradient(45deg, #1890ff, #40a9ff);
  border: none;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow:
      0 8px 20px rgba(24, 144, 255, 0.4),
      0 0 15px rgba(24, 144, 255, 0.2);
  }
  50% {
    box-shadow:
      0 8px 25px rgba(24, 144, 255, 0.6),
      0 0 25px rgba(24, 144, 255, 0.4);
  }
}
</style>

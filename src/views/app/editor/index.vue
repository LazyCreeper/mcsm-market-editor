<script setup lang="ts">
import { h } from 'vue'
import CardPanel from '@/components/CardPanel.vue'
import type { QuickStartPackages, QuickStartTemplate } from '@/types'
import { isCN, t } from '@/utils/i18n'
import {
  CopyOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  SelectOutlined
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
    message.error(t('TXT_CODE_aa13fde2') + `${error}`)
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
  return generateOptionsList(packages, 'gameType', t('TXT_CODE_107695d'))
})

const appCategoryList = computed(() => {
  const packages = getFilteredPackages(
    (item) => matchesLanguageFilter(item) && matchesGameTypeFilter(item)
  )
  return generateOptionsList(packages, 'category', t('TXT_CODE_2af87548'))
})

const appPlatformList = computed(() => {
  const packages = getFilteredPackages(
    (item) => matchesLanguageFilter(item) && matchesGameTypeFilter(item)
  )
  return generateOptionsList(packages, 'platform', t('TXT_CODE_47203b64'))
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

const downloadMarketJson = () => {
  if (!appList.value) return message.warning(t('TXT_CODE_8e223f23'))
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
  message.success(t('TXT_CODE_38fb23a8'))
}

const findFn = (pkg: QuickStartPackages, item: QuickStartPackages) =>
  pkg.targetLink === item.targetLink &&
  pkg.title === item.title &&
  pkg.gameType === item.gameType &&
  pkg.language === item.language &&
  pkg.platform === item.platform &&
  pkg.category === item.category
const editorRef = ref<InstanceType<typeof Editor>>()
const toEdit = (item: QuickStartPackages) => {
  const actualIndex = appList.value?.packages.findIndex((pkg) => findFn(pkg, item))
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

const multipleMode = ref(false)
const selectedItems = ref<QuickStartPackages[]>([])
const toMultiMode = () => {
  multipleMode.value = true
}

const findItem = (item: QuickStartPackages) => selectedItems.value.find((i) => findFn(i, item))

const selectItem = (item: QuickStartPackages) => {
  if (findItem(item)) {
    selectedItems.value.splice(selectedItems.value.indexOf(item), 1)
  } else {
    selectedItems.value.push(item)
  }
}

const handleSelectItem = (item: QuickStartPackages) => {
  if (item.isSummary) return
  if (multipleMode.value) {
    selectItem(item)
  } else {
    toEdit(item)
  }
}

const selectAllItems = () => {
  if (dynamicList.value.length === selectedItems.value.length) {
    selectedItems.value = []
  } else {
    for (const item of dynamicList.value) {
      if (item.isSummary) continue
      if (findItem(item)) continue
      selectedItems.value.push(item)
    }
  }
}

const exitMultipleMode = () => {
  multipleMode.value = false
  selectedItems.value = []
}

const batchDelete = () => {
  if (selectedItems.value.length === 0) return message.warning(t('TXT_CODE_72952e19'))
  for (const item of selectedItems.value) {
    const index = appList.value?.packages.findIndex((pkg) => findFn(pkg, item))
    if (Number(index) < 0) continue
    appList.value?.packages.splice(Number(index), 1)
  }
  selectedItems.value = []
  message.success(t('TXT_CODE_28190dbc'))
}

onMounted(() => {
  fetchTemplate()
})
</script>

<template>
  <div class="my-8"></div>
  <a-typography-title :level="3" style="margin-bottom: 8px">
    <EditOutlined />
    {{ t('TXT_CODE_dfd4fc5a') }}
  </a-typography-title>
  <a-typography-paragraph>
    <div>
      {{
        t(
          'TXT_CODE_372e7b9c'
        )
      }}
    </div>
    <div class="opacity-70">*{{ t('TXT_CODE_24821a7e') }}</div>
  </a-typography-paragraph>
  <a-form layout="horizontal" :model="searchForm" class="flex flex-wrap justify-between">
    <div class="flex flex-wrap gap-4">
      <a-form-item class="mb-0">
        <a-button
          class="btn-has-icon"
          type="primary"
          size="large"
          @click="toCopy(JSON.stringify(appList))"
        >
          {{ t('TXT_CODE_29efd001') }}
          <CopyOutlined />
        </a-button>
      </a-form-item>

      <a-form-item class="mb-0">
        <a-button
          class="button-color-success btn-has-icon"
          size="large"
          @click="downloadMarketJson"
        >
          {{ t('TXT_CODE_c5a46eba') }}
          <DownloadOutlined />
        </a-button>
      </a-form-item>

      <!-- <a-form-item class="mb-0">
        <a-button class="btn-has-icon" type="default" size="large" @click="checkRaw">
          {{ t('TXT_CODE_9f1885b4') }}
          <FileTextOutlined />
        </a-button>
      </a-form-item> -->
    </div>

    <div class="flex flex-wrap gap-4">
      <template v-if="multipleMode">
        <a-form-item class="mb-0">
          <div class="p-[8px]">{{ t('TXT_CODE_379fa48a') }}: {{ selectedItems.length }} {{ t('TXT_CODE_5cd3b4bd') }}</div>
        </a-form-item>

        <a-form-item class="mb-0">
          <a-button class="btn-has-icon" type="default" size="large" @click="exitMultipleMode">
            {{ t('TXT_CODE_5366af54') }}
          </a-button>
        </a-form-item>

        <a-form-item class="mb-0">
          <a-button class="btn-has-icon" type="default" size="large" @click="selectAllItems">
            {{ dynamicList.length === selectedItems.length ? t('TXT_CODE_df87c46d') : t('TXT_CODE_f466d7a') }}
          </a-button>
        </a-form-item>
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item
                v-for="item in [
                  {
                    title: t('TXT_CODE_ecbd7449'),
                    icon: DeleteOutlined,
                    click: batchDelete
                  }
                ]"
                :key="item.title"
                @click="item.click"
              >
                <component :is="item.icon" />
                {{ item.title }}
              </a-menu-item>
            </a-menu>
          </template>
          <a-button class="btn-has-icon" size="large" type="primary">
            {{ t('TXT_CODE_8fd8bfd3') }}
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </template>
      <a-form-item v-else class="mb-0">
        <a-button class="btn-has-icon" type="default" size="large" @click="toMultiMode">
          {{ t('TXT_CODE_5cb656b9') }}
        </a-button>
      </a-form-item>

      <a-form-item class="mb-0">
        <a-button class="button-color-success btn-has-icon" size="large" @click="editorRef?.open()">
          {{ t('TXT_CODE_3d45d8d') }}
          <PlusOutlined />
        </a-button>
      </a-form-item>
    </div>
  </a-form>

  <a-typography-title :level="3" style="margin-bottom: 8px">
    <DatabaseOutlined />
    {{ t('TXT_CODE_82ca0616') }}
  </a-typography-title>
  <a-typography-paragraph>
    <div>
      <p>
        <span>{{
          t('TXT_CODE_c9ce7427')
        }}</span>
        <!-- <span v-if="onlyDockerTemplate">
          <br />
          {{ t("TXT_CODE_de9b7cc0") }}
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
          {{ t('TXT_CODE_7fca723a') }}
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
            :placeholder="t('TXT_CODE_81aff02b')"
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
            :placeholder="t('TXT_CODE_107695d')"
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
            :placeholder="t('TXT_CODE_47203b64')"
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
            :placeholder="t('TXT_CODE_ebbb2def')"
          >
            <a-select-option v-for="item in appCategoryList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item class="mb-0">
          <a-button type="default" size="large" @click="handleReset">
            {{ t('TXT_CODE_e4c71d84') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>

    <!-- Empty state - shown when no packages match current filters -->
    <a-col v-if="dynamicList.length === 0" :span="24">
      <div style="display: flex; justify-content: center; align-items: center; height: 40vh">
        <a-typography-paragraph :style="{ color: 'var(--color-gray-7)' }">
          {{ t('TXT_CODE_c0eefecc') }}
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
        <CardPanel
          style="flex-grow: 1; padding: 12px"
          :class="{ selected: multipleMode && findItem(item) }"
          :full-height="!item.isSummary"
        >
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
                          ? t('TXT_CODE_9693b0e1')
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
                      <span style="opacity: 0.6">{{ t('TXT_CODE_80c85070') }}: </span>
                      <span>{{ item.runtime }}</span>
                    </p>
                    <p v-if="item.hardware">
                      <span style="opacity: 0.6">{{ t('TXT_CODE_683e3033') }}: </span>
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
                  @click="handleSelectItem(item)"
                >
                  <!-- 要获取原来在applist里面的 i,而不是筛选过后的i -->
                  <template #icon>
                    <SelectOutlined v-if="multipleMode" />
                    <DownloadOutlined v-else />
                  </template>
                  {{ multipleMode ? (findItem(item) ? t('TXT_CODE_abedfd03') : t('TXT_CODE_7b2c5414')) : t('TXT_CODE_1704ea49') }}
                </a-button>

                <a-button
                  v-else
                  block
                  type="primary"
                  size="large"
                  class="download-button btn-has-icon"
                  @click="searchForm.gameType = item.gameType"
                >
                  {{ t('TXT_CODE_530f5951') }}
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

.selected {
  border: 1px solid var(--color-blue-6);
  user-select: none;

  &:hover {
    border: 1px solid var(--color-blue-6);
    transition: all 0.3s;
    box-shadow: inset 0 0 0 0.5px var(--color-blue-6);
  }
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

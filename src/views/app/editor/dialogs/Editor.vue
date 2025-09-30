<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/utils/i18n'
import type { QuickStartPackages } from '@/types'
import { message, type FormInstance } from 'ant-design-vue'
import _ from 'lodash'
import { PlusOutlined } from '@ant-design/icons-vue'

interface FilterOption {
  label: string
  value: string
}

const props = defineProps<{
    gL: FilterOption[]
    pL: FilterOption[]
    cL: FilterOption[]
  }>(),
  status = ref(false),
  title = ref(''),
  loading = ref(false),
  editMode = ref<boolean>(true),
  activeKey = ref('1'),
  // TODO: 使用 Class
  defaultFormData: QuickStartPackages = {
    language: '',
    description: '',
    title: '',
    category: '',
    runtime: '',
    size: '',
    hardware: '',
    remark: '',
    targetLink: '',
    author: '',
    setupInfo: {
      startCommand: '',
      stopCommand: '',
      ie: '',
      oe: '',
      type: '',
      tag: [''],
      fileCode: '',
      processType: '',
      updateCommand: '',
      docker: {
        image: '',
        ports: [],
        extraVolumes: [],
        workingDir: '',
        env: [],
        changeWorkdir: false
      }
    },
    gameType: '',
    image: '',
    platform: '',
    tags: [],
    isSummary: false
  },
  formRef = ref<FormInstance>(),
  formData = ref<QuickStartPackages>(),
  index = ref(-1),
  isDockerMode = computed(() => formData.value?.setupInfo?.processType === 'docker'),
  VNodes = defineComponent({
    props: {
      vnodes: {
        type: Object,
        required: true
      }
    },
    render() {
      return this.vnodes
    }
  }),
  SEARCH_ALL_KEY = 'ALL',
  selectOptions = ref({
    appGameTypeList: props.gL,
    appPlatformList: props.pL,
    appCategoryList: props.cL
  }),
  searchFormData = ref<{
    appGameTypeList: string
    appPlatformList: string
    appCategoryList: string
  }>({
    appGameTypeList: '',
    appPlatformList: '',
    appCategoryList: ''
  }),
  // TODO：删除无用的项
  addOption = (item: string, category: keyof typeof selectOptions.value) => {
    selectOptions.value[category].push({
      label: item,
      value: item
    })
    searchFormData.value[category] = ''
  },
  emits = defineEmits(['ok']),
  open = (item?: QuickStartPackages, i?: number) => {
    selectOptions.value.appGameTypeList = props.gL
    selectOptions.value.appPlatformList = props.pL
    selectOptions.value.appCategoryList = props.cL
    if (item) {
      formData.value = _.cloneDeep(item)
      if (!formData.value.setupInfo?.docker)
        formData.value.setupInfo!.docker = _.cloneDeep(defaultFormData.setupInfo!.docker)
      editMode.value = true
    } else {
      formData.value = _.cloneDeep(defaultFormData)
      editMode.value = false
    }
    title.value = editMode.value ? t('编辑模板') : t('新增模板')
    index.value = i ?? -1
    status.value = true
  },
  cancel = () => {
    status.value = false
    formRef.value?.resetFields()
    formData.value = {} as QuickStartPackages
  },
  ok = async () => {
    try {
      loading.value = true
      await formRef.value?.validate()

      message.success(editMode.value ? t('保存成功') : t('创建成功'))
      emits('ok', _.cloneDeep(formData.value), index.value)
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
  <a-modal
    v-model:open="status"
    centered
    class="min-w-[50svw]"
    :title
    :mask-closable="false"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form v-if="formData" ref="formRef" :model="formData" layout="vertical">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" :tab="t('模板信息')">
          <a-row :gutter="20">
            <a-col :span="24" :sm="24" :md="12">
              <a-form-item :label="t('封面图')" name="image">
                <a-image :src="formData.image" />
                <a-input v-model:value="formData.image" />
              </a-form-item>
            </a-col>
            <a-col :span="24" :sm="24" :md="12">
              <a-form-item :label="t('模板名称')" name="title">
                <a-input v-model:value="formData.title" />
              </a-form-item>

              <a-form-item :label="t('介绍')" name="description">
                <a-textarea
                  v-model:value="formData.description"
                  allow-clear
                  size="large"
                  :auto-size="{ minRows: 1 }"
                />
              </a-form-item>

              <a-row :gutter="20">
                <a-col :span="12">
                  <a-form-item :label="t('语言')" name="language">
                    <a-select v-model:value="formData.language" :placeholder="t('请选择语言')">
                      <a-select-option value="zh_cn">简体中文</a-select-option>
                      <a-select-option value="en_us">English</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item :label="t('模板作者 / 提供者')" name="author">
                    <a-input v-model:value="formData.author" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>

          <a-row :gutter="20">
            <a-col :span="8">
              <a-form-item :label="t('一级分类（游戏名称）')" name="gameType">
                <a-select
                  v-model:value="formData.gameType"
                  show-search
                  :placeholder="t('所有游戏')"
                  :options="
                    selectOptions.appGameTypeList.filter((item) => item.value !== SEARCH_ALL_KEY)
                  "
                >
                  <template #dropdownRender="{ menuNode: menu }">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <a-space style="padding: 4px 8px">
                      <a-input ref="inputRef" v-model:value="searchFormData.appGameTypeList" />
                      <a-button
                        class="btn-has-icon"
                        type="text"
                        @click="addOption(searchFormData.appGameTypeList, 'appGameTypeList')"
                      >
                        <template #icon>
                          <PlusOutlined />
                        </template>
                        {{ t('添加') }}
                      </a-button>
                    </a-space>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('运行平台')" name="platform">
                <a-select
                  v-model:value="formData.platform"
                  show-search
                  :placeholder="t('所有系统')"
                  :options="selectOptions.appPlatformList"
                >
                  <template #dropdownRender="{ menuNode: menu }">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <a-space style="padding: 4px 8px">
                      <a-input ref="inputRef" v-model:value="searchFormData.appPlatformList" />
                      <a-button
                        class="btn-has-icon"
                        type="text"
                        @click="addOption(searchFormData.appPlatformList, 'appPlatformList')"
                      >
                        <template #icon>
                          <PlusOutlined />
                        </template>
                        {{ t('添加') }}
                      </a-button>
                    </a-space>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('二级分类（版本类型）')" name="category">
                <a-select
                  v-model:value="formData.category"
                  show-search
                  :placeholder="t('最新版本')"
                  :options="selectOptions.appCategoryList"
                >
                  <template #dropdownRender="{ menuNode: menu }">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0" />
                    <a-space style="padding: 4px 8px">
                      <a-input ref="inputRef" v-model:value="searchFormData.appCategoryList" />
                      <a-button
                        class="btn-has-icon"
                        type="text"
                        @click="addOption(searchFormData.appCategoryList, 'appCategoryList')"
                      >
                        <template #icon>
                          <PlusOutlined />
                        </template>
                        {{ t('添加') }}
                      </a-button>
                    </a-space>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="20">
            <a-col :span="8">
              <a-form-item :label="t('环境需求')" name="runtime">
                <a-input v-model:value="formData.runtime" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('硬件要求')" name="hardware">
                <a-input v-model:value="formData.hardware" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('安装包体积（可选）')" name="size">
                <a-input v-model:value="formData.size" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item :label="t('安装包下载地址（可选）')" name="targetLink">
            <a-input v-model:value="formData.targetLink" />
          </a-form-item>

          <a-form-item :label="t('标签（可选）')" name="tags">
            <a-select
              v-model:value="formData.tags"
              mode="tags"
              :token-separators="[',']"
            ></a-select>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane v-if="formData.setupInfo" key="2" :tab="t('服务器配置与运行信息')" force-render>
          <a-form-item :label="t('启动命令（不要换行）')" :name="['setupInfo', 'startCommand']">
            <a-textarea
              v-model:value="formData.setupInfo.startCommand"
              allow-clear
              size="large"
              :auto-size="{ minRows: 1 }"
              :placeholder="t('留空则使用容器自带的入口程序（EntryPoint）')"
            />
          </a-form-item>
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item :label="t('停止命令')" :name="['setupInfo', 'stopCommand']">
                <a-textarea
                  v-model:value="formData.setupInfo.stopCommand"
                  allow-clear
                  size="large"
                  :auto-size="{ minRows: 1 }"
                  :placeholder="t('点击“关闭”按钮时执行的命令')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="t('更新命令（可选）')" :name="['setupInfo', 'updateCommand']">
                <a-textarea
                  v-model:value="formData.setupInfo.updateCommand"
                  allow-clear
                  size="large"
                  :auto-size="{ minRows: 1 }"
                  :placeholder="t('点击“更新”按钮时执行的命令')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="20">
            <a-col :span="8">
              <a-form-item :label="t('输入编码格式')" :name="['setupInfo', 'ie']">
                <a-input
                  v-model:value="formData.setupInfo.ie"
                  :placeholder="t('建议保持默认值：utf8')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('输出编码格式')" :name="['setupInfo', 'oe']">
                <a-input
                  v-model:value="formData.setupInfo.oe"
                  :placeholder="t('建议保持默认值：utf8')"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('文件编码格式')" :name="['setupInfo', 'fileCode']">
                <a-input
                  v-model:value="formData.setupInfo.fileCode"
                  :placeholder="t('建议保持默认值：utf8')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- TODO: select 标签 -->
          <a-form-item :label="t('附加标签（可选）')" :name="['setupInfo', 'tag']">
            <a-select
              v-model:value="formData.setupInfo.tag"
              mode="tags"
              :token-separators="[',']"
            ></a-select>
          </a-form-item>
        </a-tab-pane>
        <a-tab-pane v-if="formData.setupInfo?.docker" key="3" :tab="t('Docker 配置')" force-render>
          <a-row :gutter="20">
            <a-col :span="8">
              <a-form-item :label="t('启用 Docker 容器')" :name="['setupInfo', 'processType']">
                <a-switch
                  v-model:checked="formData.setupInfo.processType"
                  checked-value="docker"
                  un-checked-value="undefined"
                >
                </a-switch>
              </a-form-item>
            </a-col>
            <a-col :span="16">
              <a-form-item :label="t('镜像名称')" :name="['setupInfo', 'docker', 'image']">
                <a-input
                  v-model:value="formData.setupInfo.docker.image"
                  :disabled="!isDockerMode"
                  :placeholder="t('格式为“镜像名:标签”，latest 表示最新版本')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="20">
            <a-col :span="18">
              <a-form-item
                :label="t('容器内工作目录')"
                :name="['setupInfo', 'docker', 'workingDir']"
              >
                <a-input
                  v-model:value="formData.setupInfo.docker.workingDir"
                  :disabled="!isDockerMode"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item
                :label="t('强制切换到工作目录')"
                :name="['setupInfo', 'docker', 'changeWorkdir']"
              >
                <a-switch
                  v-model:checked="formData.setupInfo.docker.changeWorkdir"
                  :disabled="!isDockerMode"
                ></a-switch>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="20">
            <a-col :span="8">
              <a-form-item :label="t('端口映射')" :name="['setupInfo', 'docker', 'ports']">
                <a-input
                  v-model:value="formData.setupInfo.docker.ports"
                  :disabled="!isDockerMode"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                :label="t('额外挂载目录（可选）')"
                :name="['setupInfo', 'docker', 'extraVolumes']"
              >
                <a-input
                  v-model:value="formData.setupInfo.docker.extraVolumes"
                  :disabled="!isDockerMode"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item :label="t('环境变量（可选）')" :name="['setupInfo', 'docker', 'env']">
                <a-input v-model:value="formData.setupInfo.docker.env" :disabled="!isDockerMode" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </a-modal>
</template>

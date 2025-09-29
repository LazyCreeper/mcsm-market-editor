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
  emits = defineEmits(['ok']),
  open = (item?: QuickStartPackages, i?: number) => {
    if (item) {
      formData.value = _.cloneDeep(item)
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
              :autosize="{ minRows: 1 }"
            />
          </a-form-item>

          <!-- TODO：改为下拉选择 -->
          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item :label="t('语言')" name="language">
                <a-input v-model:value="formData.language" />
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
            <a-input v-model:value="formData.gameType" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('运行平台')" name="platform">
            <a-input v-model:value="formData.platform" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('二级分类（版本类型）')" name="category">
            <a-input v-model:value="formData.category" />
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

      <!-- TODO: select 标签 -->
      <a-form-item :label="t('标签（可选）')" name="tags">
        <a-input v-model:value="formData.tags" />
      </a-form-item>

      <template v-if="formData.setupInfo">
        <a-divider dashed>{{ t('服务器配置与运行信息') }}</a-divider>

        <a-form-item :label="t('启动命令（不要换行）')" name="setupInfo.startCommand">
          <a-textarea
            v-model:value="formData.setupInfo.startCommand"
            allow-clear
            size="large"
            :autosize="{ minRows: 1 }"
            :placeholder="t('留空则使用容器自带的入口程序（EntryPoint）')"
          />
        </a-form-item>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item :label="t('停止命令')" name="setupInfo.stopCommand">
              <a-textarea
                v-model:value="formData.setupInfo.stopCommand"
                allow-clear
                size="large"
                :autosize="{ minRows: 1 }"
                :placeholder="t('点击“关闭”按钮时执行的命令')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="t('更新命令（可选）')" name="setupInfo.updateCommand">
              <a-textarea
                v-model:value="formData.setupInfo.updateCommand"
                allow-clear
                size="large"
                :autosize="{ minRows: 1 }"
                :placeholder="t('点击“更新”按钮时执行的命令')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item :label="t('输入编码格式')" name="ie">
              <a-input
                v-model:value="formData.setupInfo.ie"
                :placeholder="t('建议保持默认值：utf8')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="t('输出编码格式')" name="oe">
              <a-input
                v-model:value="formData.setupInfo.oe"
                :placeholder="t('建议保持默认值：utf8')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="t('文件编码格式')" name="fileCode">
              <a-input
                v-model:value="formData.setupInfo.fileCode"
                :placeholder="t('建议保持默认值：utf8')"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- TODO: select 标签 -->
        <a-form-item :label="t('附加标签（可选）')" name="setupInfo.tag">
          <a-input v-model:value="formData.setupInfo.tag" />
        </a-form-item>

        <!-- Docker -->
        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item :label="t('启用 Docker 容器')" name="setupInfo.processType">
              <a-input v-model:value="formData.setupInfo.processType" />
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item :label="t('镜像名称')" name="setupInfo.docker.image">
              <a-input v-model:value="formData.setupInfo.docker.image" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20">
          <a-col :span="18">
            <a-form-item :label="t('容器内工作目录')" name="setupInfo.docker.workingDir">
              <a-input v-model:value="formData.setupInfo.docker.workingDir" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="t('强制切换到工作目录')" name="setupInfo.docker.changeWorkdir">
              <a-switch v-model:checked="formData.setupInfo.docker.changeWorkdir"></a-switch>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="20">
          <a-col :span="8">
            <a-form-item :label="t('端口映射')" name="setupInfo.docker.ports">
              <a-textarea
                v-model:value="formData.setupInfo.docker.ports"
                allow-clear
                size="large"
                :autosize="{ minRows: 1 }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="t('额外挂载目录（可选）')" name="setupInfo.docker.extraVolumes">
              <a-input v-model:value="formData.setupInfo.docker.extraVolumes" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="t('环境变量（可选）')" name="setupInfo.docker.env">
              <a-input v-model:value="formData.setupInfo.docker.env" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>
    </a-form>
  </a-modal>
</template>

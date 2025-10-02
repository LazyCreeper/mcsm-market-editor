<script setup lang="ts">
import { h } from 'vue'
import type { MountComponent } from '@/types'
import type { AntColumnsType, AntTableCell } from '@/types/ant'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'
import { emptyValueValidator } from '@/utils'
import { message, type FormInstance } from 'ant-design-vue'
import { t } from '@/utils/i18n'

interface Props extends MountComponent {
  title: string
  keyTitle?: string
  valueTitle?: string
  data: any[]
  newDataTemplate?: any
  subtitle?: string
  columns?: AntColumnsType[]
}

const props = defineProps<Props>()
const dataSource = ref<any[]>(props.data instanceof Array ? _.cloneDeep(props.data) : [])

const open = ref(true)
const formInstance = ref<FormInstance>()

const cancel = async () => {
  open.value = false
  if (props.destroyComponent) props.destroyComponent()
}

const submit = async () => {
  try {
    await formInstance.value?.validate()
  } catch (error: any) {
    console.error(error)
    return message.error(t('TXT_CODE_6a365d01'))
  }
  if (props.emitResult) props.emitResult(dataSource.value)
  await cancel()
}

const columns = computed<AntColumnsType[]>(() => {
  if (props.columns) {
    return [
      ...props.columns,
      {
        align: 'center',
        key: 'operation',
        dataIndex: 'operation',
        title: t('TXT_CODE_fe731dfc')
      }
    ]
  }
  return [
    {
      align: 'center',
      key: 'k',
      dataIndex: 'k',
      title: props.keyTitle
    },
    {
      align: 'center',
      key: 'v',
      dataIndex: 'v',
      title: props.valueTitle
    },
    {
      align: 'center',
      key: 'operation',
      dataIndex: 'operation',
      title: t('TXT_CODE_fe731dfc')
    }
  ]
})

const operation = (type: 'add' | 'del', index = 0) => {
  if (type === 'add') {
    if (props.newDataTemplate) {
      dataSource.value.push(_.cloneDeep(props.newDataTemplate))
    } else {
      const keys = columns.value.filter((v) => v.dataIndex).map((v) => String(v.dataIndex))
      const obj: any = {}
      for (const key of keys) {
        if (key === 'operation') continue
        obj[key] = ''
      }
      dataSource.value.push(obj)
    }
  } else {
    dataSource.value.splice(index, 1)
  }
}
</script>

<template>
  <a-modal
    v-model:open="open"
    centered
    width="600px"
    :mask-closable="false"
    :title="props.title"
    @ok="submit"
    @cancel="cancel"
  >
    <div>
      <div class="text-sm text-gray-500">
        <pre class="font-sans whitespace-pre-wrap" v-html="props.subtitle"></pre>
      </div>
      <div class="mb-4 flex justify-end">
        <a-button :icon="h(PlusCircleOutlined)" @click="operation('add')">
          {{ t('TXT_CODE_dfc17a0c') }}
        </a-button>
      </div>
      <a-form ref="formInstance" :model="dataSource" name="validate_other">
        <a-table :data-source="dataSource" :columns="columns" :pagination="false">
          <template #bodyCell="{ column, record, index }: AntTableCell">
            <template v-if="column.dataIndex === 'operation'">
              <div class="flex-center flex-between">
                <div>
                  <a-button
                    :icon="h(MinusCircleOutlined)"
                    danger
                    @click="operation('del', index)"
                  ></a-button>
                </div>
              </div>
            </template>
            <template v-else>
              <a-form-item
                :name="String(column.dataIndex)"
                no-style
                :rules="[
                  {
                    validator: () => emptyValueValidator(record[String(column.dataIndex)]),
                    trigger: 'change'
                  }
                ]"
              >
                <a-input
                  v-model:value="record[String(column.dataIndex)]"
                  :placeholder="(column as any).placeholder"
                />
              </a-form-item>
            </template>
          </template>
        </a-table>
      </a-form>
    </div>
  </a-modal>
</template>

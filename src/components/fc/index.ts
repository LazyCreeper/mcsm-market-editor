import { useMountComponent } from '@/hooks/useMountComponent'
import KvOptionsDialogVue from '@/components/fc/KvOptionsDialog.vue'
import type { AntColumnsType } from '@/types/ant'
import { t } from '@/utils/i18n'

interface DockerConfigItem {
  host: string
  container: string
}
interface PortConfigItem extends DockerConfigItem {
  protocol: string
}

interface DockerEnvItem {
  label: string
  value: string
}

export async function usePortEditDialog(data: PortConfigItem[] = []) {
  return (
    (await useMountComponent({
      data,
      title: t('TXT_CODE_c4435af9'),
      subtitle: t(
        'TXT_CODE_56b9e6af'
      ),
      columns: [
        {
          align: 'center',
          dataIndex: 'host',
          title: t('TXT_CODE_534db0b2'),
          placeholder: 'eg: 8080 or {mcsm_port1}',
          minWidth: 200
        },
        {
          align: 'center',
          dataIndex: 'container',
          title: t('TXT_CODE_b729d2e'),
          placeholder: 'eg: 25565 or {mcsm_port1}'
        },
        {
          align: 'center',
          dataIndex: 'protocol',
          title: t('TXT_CODE_ad1c674c'),
          placeholder: 'TCP/UDP'
        }
      ] as AntColumnsType[]
    }).mount<PortConfigItem[]>(KvOptionsDialogVue)) || []
  )
}

export async function useVolumeEditDialog(data: DockerConfigItem[] = []) {
  return (
    (await useMountComponent({
      data,
      subtitle: t(
        'TXT_CODE_77083c51'
      ),
      title: t('TXT_CODE_820ebc92'),
      columns: [
        {
          align: 'center',
          dataIndex: 'host',
          title: t('TXT_CODE_681aaeb9')
        },
        {
          align: 'center',
          dataIndex: 'container',
          title: t('TXT_CODE_30258325')
        }
      ] as AntColumnsType[]
    }).mount<DockerConfigItem[]>(KvOptionsDialogVue)) || []
  )
}

export async function useDockerEnvEditDialog(data: DockerEnvItem[] = []) {
  return (
    (await useMountComponent({
      data,
      title: t('TXT_CODE_90a9d317'),
      columns: [
        {
          align: 'center',
          dataIndex: 'label',
          title: t('TXT_CODE_a42984e')
        },
        {
          align: 'center',
          dataIndex: 'value',
          title: t('TXT_CODE_115e8a25')
        }
      ] as AntColumnsType[]
    }).mount<DockerEnvItem[]>(KvOptionsDialogVue)) || []
  )
}

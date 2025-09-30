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
      title: t('容器端口映射配置'),
      subtitle: t(
        '默认情况下，MCSManager 为每个实例按序分配 5 个端口，支持填写 {mcsm_port1} 到 {mcsm_port5}，为按序新增的端口号。'
      ),
      columns: [
        {
          align: 'center',
          dataIndex: 'host',
          title: t('主机端口'),
          placeholder: 'eg: 8080 or {mcsm_port1}',
          minWidth: 200
        },
        {
          align: 'center',
          dataIndex: 'container',
          title: t('容器端口'),
          placeholder: 'eg: 25565 or {mcsm_port1}'
        },
        {
          align: 'center',
          dataIndex: 'protocol',
          title: t('协议'),
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
        '用于挂载主机上额外的文件夹到容器中，支持 &lbrace;mcsm_workspace&rbrace;（工作目录）和 &lbrace;mcsm_instance_id&rbrace;（实例ID）两个变量字符串。'
      ),
      title: t('挂载目录到容器'),
      columns: [
        {
          align: 'center',
          dataIndex: 'host',
          title: t('主机目录')
        },
        {
          align: 'center',
          dataIndex: 'container',
          title: t('容器目录')
        }
      ] as AntColumnsType[]
    }).mount<DockerConfigItem[]>(KvOptionsDialogVue)) || []
  )
}

export async function useDockerEnvEditDialog(data: DockerEnvItem[] = []) {
  return (
    (await useMountComponent({
      data,
      title: t('容器环境变量'),
      columns: [
        {
          align: 'center',
          dataIndex: 'label',
          title: t('变量名')
        },
        {
          align: 'center',
          dataIndex: 'value',
          title: t('变量值')
        }
      ] as AntColumnsType[]
    }).mount<DockerEnvItem[]>(KvOptionsDialogVue)) || []
  )
}

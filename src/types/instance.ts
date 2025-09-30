import { t } from '@/utils/i18n'

export const TERMINAL_CODE = [
  'UTF-8',
  'GBK',
  'GB2312',
  'GB18030',
  'BIG5',
  'Big5-HKSCS',
  'Shift_JIS',
  'KS_C_5601',
  'UTF-16'
]

export const TYPE_UNIVERSAL = 'universal'
export const TYPE_WEB_SHELL = 'universal/web_shell'
export const TYPE_MINECRAFT_MCDR = 'universal/mcdr'
export const TYPE_MINECRAFT_JAVA = 'minecraft/java'
export const TYPE_MINECRAFT_BUKKIT = 'minecraft/java/bukkit'
export const TYPE_MINECRAFT_SPIGOT = 'minecraft/java/spigot'
export const TYPE_MINECRAFT_PAPER = 'minecraft/java/paper'
export const TYPE_MINECRAFT_PUFFERFISH = 'minecraft/java/pufferfish'
export const TYPE_MINECRAFT_FORGE = 'minecraft/java/forge'
export const TYPE_MINECRAFT_NEOFORGE = 'minecraft/java/neoforge'
export const TYPE_MINECRAFT_FABRIC = 'minecraft/java/fabric'
export const TYPE_MINECRAFT_BUNGEECORD = 'minecraft/java/bungeecord'
export const TYPE_MINECRAFT_VELOCITY = 'minecraft/java/velocity'
export const TYPE_MINECRAFT_GEYSER = 'minecraft/java/geyser'
export const TYPE_MINECRAFT_SPONGE = 'minecraft/java/sponge'
export const TYPE_MINECRAFT_MOHIST = 'minecraft/java/mohist'
export const TYPE_MINECRAFT_PURPUR = 'minecraft/java/purpur'
export const TYPE_MINECRAFT_BEDROCK = 'minecraft/bedrock'
export const TYPE_MINECRAFT_BDS = 'minecraft/bedrock/bds'
export const TYPE_MINECRAFT_NUKKIT = 'minecraft/bedrock/nukkit'
export const TYPE_STEAM_SERVER_UNIVERSAL = 'steam/universal'
export const TYPE_TERRARIA = 'steam/terraria'

export const INSTANCE_TYPE_TRANSLATION: {
  [key: string]: string
} = {
  [TYPE_UNIVERSAL]: t('通用控制台程序'),
  [TYPE_STEAM_SERVER_UNIVERSAL]: t('Steam 游戏服务器'),
  [TYPE_MINECRAFT_JAVA]: t('MC Java 版服务端'),
  [TYPE_MINECRAFT_BEDROCK]: t('MC Bedrock 版服务端'),
  [TYPE_MINECRAFT_NUKKIT]: 'MC Nukkit',
  [TYPE_MINECRAFT_SPIGOT]: 'MC Spigot',
  [TYPE_MINECRAFT_PAPER]: 'MC Paper',
  [TYPE_MINECRAFT_PUFFERFISH]: 'MC Pufferfish',
  [TYPE_MINECRAFT_BUNGEECORD]: 'MC BungeeCord',
  [TYPE_MINECRAFT_VELOCITY]: 'MC Velocity',
  [TYPE_MINECRAFT_PURPUR]: 'MC Purpur',
  [TYPE_MINECRAFT_BDS]: 'MC Bedrock',
  [TYPE_MINECRAFT_SPONGE]: 'MC Sponge',
  [TYPE_MINECRAFT_FORGE]: 'MC Forge',
  [TYPE_MINECRAFT_NEOFORGE]: 'MC NeoForge',
  [TYPE_MINECRAFT_FABRIC]: 'MC Fabric',
  [TYPE_MINECRAFT_BUKKIT]: 'MC Bukkit',
  [TYPE_MINECRAFT_GEYSER]: 'MC Geyser',
  [TYPE_MINECRAFT_MCDR]: 'MC MCDR',
  [TYPE_WEB_SHELL]: 'Web Shell',
  [TYPE_TERRARIA]: t('泰拉瑞亚')
}

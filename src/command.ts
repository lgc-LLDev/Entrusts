import { formatError, wrapAsyncFunc } from 'form-api-ex'

import { config, reloadConfig } from './config'
import { PLUGIN_NAME } from './const'
import { entrustMenu } from './form'

interface CommandResult {
  reload?: 'reload'
}

mc.listen('onServerStarted', () => {
  const cmd = mc.newCommand('entrusts', PLUGIN_NAME, PermType.Any)

  // entrusts reload
  cmd.setEnum('reload', ['reload'])
  cmd.mandatory('reload', ParamType.Enum, 'reload', 1)
  cmd.overload(['reload'])

  // entrusts
  cmd.overload([])

  cmd.setCallback((_, { player }, out, { reload }: CommandResult) => {
    // OnlyOP
    if (config.cmdOnlyOp && player && !player.isOP()) {
      out.error('仅 OP 可执行此命令')
      return false
    }

    // entrusts reload
    if (reload) {
      if (player && !player.isOP()) {
        out.error('仅 OP 可执行此命令')
        return false
      }

      try {
        reloadConfig()
      } catch (e) {
        out.error(`重载配置失败！\n${formatError(e)}`)
        return false
      }

      out.success('§a重载配置成功~')
      return true
    }

    // entrusts
    if (!player) {
      out.error('仅玩家能执行此命令')
      return false
    }
    wrapAsyncFunc(entrustMenu)(player)
    return true
  })

  cmd.setup()
})

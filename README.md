<!-- markdownlint-disable MD033 -->

# Entrusts

玩家可发布的委托系统

## 介绍 & 截图

右键（移动端长按）配置文件中配置的物品打开委托菜单  
![Alt text](https://raw.githubusercontent.com/lgc-LLSEDev/readme/main/Entrusts/1.png)

委托列表，这里可以查看所有用该物品作奖励的委托  
（如果配置文件 `allInOne` 为 `true`，这里则会显示所有委托）  
![Alt text](https://raw.githubusercontent.com/lgc-LLSEDev/readme/main/Entrusts/2.png)

他人发布的委托详情，可以进行接取（背包内对应物品要够）  
![Alt text](https://raw.githubusercontent.com/lgc-LLSEDev/readme/main/Entrusts/3.png)

发布委托界面，对应物品需要在配置项内自行配置  
![Alt text](https://raw.githubusercontent.com/lgc-LLSEDev/readme/main/Entrusts/4.png)  
![Alt text](https://raw.githubusercontent.com/lgc-LLSEDev/readme/main/Entrusts/5.png)

可以查看自己发布的委托以及完成情况（已完成的委托不会显示在委托列表）  
![Alt text](https://raw.githubusercontent.com/lgc-LLSEDev/readme/main/Entrusts/6.png)

已完成的委托详情  
![Alt text](https://raw.githubusercontent.com/lgc-LLSEDev/readme/main/Entrusts/7.png)

## 缺陷

- 目前不支持带 特殊值 / NBT 物品的委托
- 目前不支持设置多个委托物品与奖励

## 安装

### 使用 Lip

```shell
lip i entrusts
```

### 手动打包

将 `dist` 文件夹中所有内容打包成 `zip`，之后改后缀为 `llplugin` 安装即可

## 指令

### `entrusts reload`

- 权限：OP / 控制台
- 介绍：重载配置文件

### `entrusts`

- 权限：所有人
- 介绍：打开委托界面

## 配置文件

配置文件路径：`plugins/Entrusts/config.json`  
请按照下面的注释修改配置文件  
注意：实际配置文件里**不能有注释**！

```jsonc
{
  // 委托可以提交的奖励物品标列表
  "entrustItems": [
    {
      // 物品标准类型名
      "type": "minecraft:emerald",

      // 物品显示名
      "name": "绿宝石",

      // 物品显示的图标，可以不填
      "icon": "textures/items/emerald"
    }
    // ...
  ],

  // 委托可以提交的需求物品列表
  "rewardItems": [
    // 格式同上，不过没有 openItem
    {
      "type": "minecraft:diamond",
      "icon": "textures/items/diamond",
      "name": "钻石"
    }
    // ...
  ],

  // 可用于打开委托列表的物品
  // 键为打开界面所用的物品，值为对应的 entrustItem
  "openItems": {
    "minecraft:stick": ["minecraft:emerald"],
    "minecraft:feather": ["minecraft:emerald"]
    // ...
  },

  // 委托界面中，是否将所有奖励物品的委托放在一起
  // 当为 false 时，列表中将只显示对应奖励物品的委托
  "allInOne": false,

  // 是否只能使用上面配置的 openItems 来打开委托菜单
  "onlyUseOpenItem": false,

  // 是否只有 OP 能执行插件指令
  "onlyOpCmd": false
}
```

## 鸣谢

### [DT 国战服务器](https://beautifully-level-317520.framer.app/)

以促进玩家和平生存交易为主，用强职业的方式促进玩家之间的合作（农夫，建筑师，酿造师等～）。  
借助玩家发放自己的货币和交易生态圈为基础促进玩家的国家之间的交易与发展。  
有兴趣的话欢迎大家进来哇 QwQ

## 联系我

QQ：3076823485  
吹水群：[1105946125](https://jq.qq.com/?_wv=1027&k=Z3n1MpEp)  
邮箱：<lgc2333@126.com>

## 赞助

感谢大家的赞助！你们的赞助将是我继续创作的动力！

- [爱发电](https://afdian.net/@lgc2333)
- <details>
    <summary>赞助二维码（点击展开）</summary>

  ![讨饭](https://raw.githubusercontent.com/lgc2333/ShigureBotMenu/master/src/imgs/sponsor.png)

  </details>

## 更新日志

### 0.2.1

- 修复发布委托时没检查物品数量的 Bug
- 将原来 `entrustItems` 内的 `openItem` 配置单独迁移出来到 `openItems`
- 新增 `onlyOpCmd` 配置

### 0.2.0

- 优化发布委托的表单
- 委托发布者 / OP 可以撤销已发布的未完成的委托
- 加入一些配置项
- 加入一些指令
- 其他小修改

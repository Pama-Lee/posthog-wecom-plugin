# PostHog 企业微信机器人通知插件

该插件可以将 PostHog 的告警通知发送到企业微信群机器人。

## 功能特点

- 支持将 PostHog 告警实时推送到企业微信群
- 支持自定义消息模板
- 使用 Markdown 格式发送消息，提供更好的可读性
- 简单配置，仅需 Webhook URL

## 安装配置

1. 在企业微信群中添加机器人
   - 进入企业微信群
   - 点击群设置
   - 选择"群机器人" -> "添加机器人" -> "新建机器人"
   - 设置机器人名称和头像
   - 复制生成的 Webhook URL

2. 在 PostHog 中配置插件
   - 进入 PostHog 设置
   - 找到"Apps"或"插件"部分
   - 找到"企业微信机器人通知插件"并启用
   - 填入上述获取的 Webhook URL

## 配置项说明

- **Webhook URL**: 企业微信群机器人的 Webhook 地址
- **消息模板**: 自定义消息模板，支持以下变量：
  - ${alert_name}: 告警名称
  - ${trigger_time}: 触发时间
  - ${description}: 告警描述
  - ${insight_name}: 洞察名称
  - ${dashboard_name}: 仪表盘名称

## 使用示例

1. 基本配置示例：
```json
{
    "webhookUrl": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

2. 自定义消息模板示例：
```
## PostHog 告警通知

**告警名称**: ${alert_name}
**触发时间**: ${trigger_time}
**详细信息**: ${description}

> 来自仪表盘: ${dashboard_name}
> 相关洞察: ${insight_name}
```

## 故障排除

1. 如果收不到消息，请检查：
   - Webhook URL 是否正确
   - 机器人是否还在群中
   - 群是否已被解散

2. 常见错误码说明：
   - 93000: Webhook 地址不正确或已失效
   - 93004: 机器人被移出群聊
   - 90001: 消息内容格式不正确

## 开发说明

插件使用 TypeScript 开发，主要文件：

- `plugin.json`: 插件配置文件
- `index.ts`: 主要逻辑文件
- `README.md`: 说明文档

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个插件。

## 许可证

MIT License 
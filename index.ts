import { Plugin, PluginEvent, PluginMeta } from '@posthog/plugin-scaffold'

interface WeComResponse {
    errcode: number
    errmsg: string
}

interface PluginConfig {
    webhookUrl: string
    messageTemplate: string
}

export interface Meta extends PluginMeta<PluginConfig> {
    config: PluginConfig
}

// 发送企业微信机器人消息
async function sendWeComMessage(message: string, meta: Meta): Promise<void> {
    const response = await fetch(meta.config.webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            msgtype: 'markdown',
            markdown: {
                content: message,
            },
        }),
    })
    
    const result: WeComResponse = await response.json()
    if (result.errcode !== 0) {
        throw new Error(`发送企业微信消息失败: ${result.errmsg}`)
    }
}

// 格式化消息内容
function formatMessage(template: string, variables: Record<string, any>): string {
    return template.replace(/\${(\w+)}/g, (match, key) => {
        return variables[key] || match
    })
}

// 插件设置
export async function setupPlugin(meta: Meta): Promise<void> {
    // 验证配置
    if (!meta.config.webhookUrl) {
        throw new Error('请配置企业微信机器人的 Webhook URL')
    }
    
    // 测试连接
    try {
        await sendWeComMessage('PostHog 告警插件已连接', meta)
        console.info('企业微信机器人插件初始化成功')
    } catch (error) {
        console.error('企业微信机器人插件初始化失败:', error)
        throw error
    }
}

// 处理告警事件
export async function onEvent(event: PluginEvent, meta: Meta): Promise<void> {
    // 只处理告警相关事件
    if (event.event !== '$alert' && event.event !== 'alert_triggered') {
        return
    }

    try {
        const variables = {
            alert_name: event.properties?.alert_name || '未知告警',
            trigger_time: new Date().toLocaleString('zh-CN'),
            description: event.properties?.description || '无详细信息',
            insight_name: event.properties?.insight_name,
            dashboard_name: event.properties?.dashboard_name
        }

        const message = formatMessage(meta.config.messageTemplate, variables)
        await sendWeComMessage(message, meta)
        
        console.info('企业微信通知发送成功:', {
            alert_name: variables.alert_name,
            trigger_time: variables.trigger_time
        })
    } catch (error) {
        console.error('企业微信通知发送失败:', error)
        throw error
    }
} 
export default {
    web_name: process.env.VUE_APP_WEBSITE_NAME || 'Lumen IM',
    api_url: process.env.VUE_APP_API_BASE_URL || '',
    ws_url: process.env.VUE_APP_WEB_SOCKET_URL || ''
}
import { createApiCall } from './request.ts'

export const ServCustomizeEmoticonList = createApiCall('/api/v1/emoticon/customize/list')

export const ServCustomizeEmoticonUpload = createApiCall('/api/v1/emoticon/customize/upload')

export const ServCustomizeEmoticonDelete = createApiCall('/api/v1/emoticon/customize/delete')

export const ServCustomizeEmoticonCreate = createApiCall('/api/v1/emoticon/customize/create')

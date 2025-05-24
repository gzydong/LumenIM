import { createApi } from './request.ts'

export const ServCustomizeEmoticonList = createApi('/api/v1/emoticon/customize/list')

export const ServCustomizeEmoticonUpload = createApi('/api/v1/emoticon/customize/upload')

export const ServCustomizeEmoticonDelete = createApi('/api/v1/emoticon/customize/delete')

export const ServCustomizeEmoticonCreate = createApi('/api/v1/emoticon/customize/create')

import { createApi } from './request.ts'

export const ServOrganizeDepartmentList = createApi<any, any>('/api/v1/organize/department/all')

export const ServOrganizePersonnelAll = createApi<any, any>('/api/v1/organize/personnel/all')

import { createApiCall } from './request.ts'

export const ServOrganizeDepartmentList = createApiCall<any, any>('/api/v1/organize/department/all')

export const ServOrganizePersonnelAll = createApiCall<any, any>('/api/v1/organize/personnel/all')

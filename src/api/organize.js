import { get } from '@/utils/request'

export const ServeDepartmentList = () => {
  return get('/api/v1/organize/department/all')
}

export const ServePersonnelList = () => {
  return get('/api/v1/organize/personnel/all')
}

export const ServeCheckQiyeMember = () => {
  return get('/api/v1/organize/member/check')
}

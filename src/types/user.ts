export interface AuthUser {
  id: string
  username: string
  email: string
  firstName?: string | null
  lastName?: string | null
  role: string
  packageType?: string | null
  packageName?: string | null
  isActive?: boolean | null
  isImpersonating?: boolean
  adminId?: string
  adminRole?: string
}

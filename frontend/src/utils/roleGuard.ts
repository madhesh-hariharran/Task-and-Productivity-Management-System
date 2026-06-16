import type { UserRole } from "../types/auth"

export const isManager = (role: UserRole | null): boolean => role === 'manager'

export const isWorker = (role: UserRole | null): boolean => role === 'worker'

export const isPersonal = (role: UserRole | null): boolean => role === 'personal'

// Both manager and worker have company accounts - they see assigned tasks

export const hasAssignedTasksAccess = (role: UserRole | null): boolean => role === 'manager' || role === 'worker'

// Only managers can assign tasks to workers
export const canAssignTasks = (role: UserRole | null): boolean => role === 'manager'

// Only managers can delete assigned tasks
export const canDeleteAssignedTasks = (role: UserRole | null): boolean => role === 'manager'

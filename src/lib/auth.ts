/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

export interface SupplierAuthResult {
  userId: string
  role: string
  warehouseAccess: string[]
}

export async function verifySupplierAuth(token?: string): Promise<SupplierAuthResult> {
  // Mock implementation for testing
  if (!token) {
    throw new Error('No authentication token provided')
  }

  // In real implementation, this would verify JWT token
  return {
    userId: 'user-123',
    role: 'supplier_manager',
    warehouseAccess: ['warehouse-us-west']
  }
}
import { isMockEnabled } from './mockApi';
import { ApiResponse } from '../types/api';

/**
 * API wrapper that selects between Mock and real API based on environment
 */
export const createApiWrapper = <T extends (...args: any[]) => Promise<ApiResponse<any>>>(
  realApi: T,
  mockApi?: T
): T => {
  return ((...args: any[]) => {
    if (isMockEnabled() && mockApi) {
      return mockApi(...args);
    }
    return realApi(...args);
  }) as T;
}
import cacheManager, { CacheManagerOptions } from '@type-cacheable/core'
import Logger from '../logger'
import LRUCacheAdapter, { cacheClient } from './LRUCacheAdapter'
import { LogLevel } from '../../core/enums'

/**
 * Service for managing in-memory caching using LRU Cache.
 */
export class CacheService {
  /**
   * Initializes the cache with LRU Cache adapter.
   */
  static initCache(): void {
    const CACHE_TTL_SECONDS = 300 // Cache TTL in seconds

    Logger.log(LogLevel.INFO, 'Initializing LRU Cache for in-memory caching...')

    cacheManager.setOptions(<CacheManagerOptions>{
      excludeContext: true,
      ttlSeconds: CACHE_TTL_SECONDS
    })

    cacheManager.client = LRUCacheAdapter
    Logger.log(LogLevel.INFO, `✅ LRU Cache enabled with TTL: ${CACHE_TTL_SECONDS} seconds`)
  }

  /**
   * Flushes all cached data.
   */
  static async flushAll(): Promise<void> {
    Logger.log(LogLevel.INFO, '🧹 Flushing all cache entries...')
    cacheClient.clear()
  }

  /**
   * Deletes a specific cache key.
   * @param key Cache key to delete.
   */
  static async flushKey(key: string): Promise<void> {
    Logger.log(LogLevel.INFO, `🧹 Removing cache entry: ${key}`)
    await LRUCacheAdapter.delHash(key)
  }
}

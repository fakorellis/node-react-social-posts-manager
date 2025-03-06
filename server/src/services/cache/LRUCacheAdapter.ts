import { LRUCache } from 'lru-cache'
import { useAdapter } from '@type-cacheable/lru-cache-adapter'
import Logger from '../logger'
import { LogLevel } from '../../core/enums'

const CACHE_MAX_ITEMS = 1000 // Max items in cache
const CACHE_TTL_SECONDS = 300 * 1000 // TTL in milliseconds (5 minutes)

/**
 * LRU Cache configuration.
 */
const options = {
  max: CACHE_MAX_ITEMS,
  ttl: CACHE_TTL_SECONDS,
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: true
}

/**
 * Initializes an LRU Cache instance.
 */
export const cacheClient = new LRUCache<string, unknown>(options)

// Use the LRU cache adapter to work with @type-cacheable/core
// @ts-ignore
const clientAdapter = useAdapter<unknown>(cacheClient)

Logger.log(LogLevel.INFO, `✅ LRU Cache initialized with max items: ${CACHE_MAX_ITEMS}, TTL: ${CACHE_TTL_SECONDS / 1000}s`)

export default clientAdapter

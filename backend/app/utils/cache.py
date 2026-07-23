import json
from typing import Optional, Any
import redis.asyncio as redis
from ..config import settings

redis_client = None

async def get_redis():
    """Get Redis client instance (bounded connection pool -- see
    REDIS_MAX_CONNECTIONS; an unbounded pool can open more connections than
    the Redis server allows under a big enough request burst)."""
    global redis_client
    if redis_client is None:
        redis_client = await redis.from_url(
            settings.REDIS_URL,
            max_connections=settings.REDIS_MAX_CONNECTIONS,
            decode_responses=True,
        )
    return redis_client

async def init_redis():
    """Initialize Redis connection"""
    await get_redis()

async def close_redis():
    """Close Redis connection"""
    global redis_client
    if redis_client:
        await redis_client.close()
        redis_client = None

async def get_cache(key: str) -> Optional[Any]:
    """Get cached data"""
    try:
        client = await get_redis()
        data = await client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception:
        return None

async def set_cache(key: str, data: Any, ttl: int = 3600):
    """Cache data with TTL"""
    try:
        client = await get_redis()
        await client.setex(
            key,
            ttl,
            json.dumps(data, default=str)
        )
    except Exception:
        pass

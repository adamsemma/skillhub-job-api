"""Request rate limiting, backed by slowapi (already in requirements.txt).

This replaces the previous hand-rolled in-memory RateLimiter, which was
fully implemented but never actually wired into the app -- routes had no
rate limiting at all. `limiter` here is a single shared instance that gets
registered on the FastAPI app in main.py and applied per-route with
`@limiter.limit(...)` decorators.

Limits are per-client-IP and reset on a rolling window. In production behind
a load balancer, make sure X-Forwarded-For is trusted appropriately (see
TrustedHostMiddleware config) so get_remote_address sees the real client IP
rather than the load balancer's.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

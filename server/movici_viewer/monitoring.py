import time
import logging
from typing import Callable
from fastapi import FastAPI, Request, Response
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
import threading
import http.server
import socketserver
from .settings import Settings

logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status_code']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections_current',
    'Current active connections'
)


class MetricsHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler for Prometheus metrics endpoint."""
    
    def do_GET(self):
        if self.path == '/metrics':
            self.send_response(200)
            self.send_header('Content-Type', CONTENT_TYPE_LATEST)
            self.end_headers()
            self.wfile.write(generate_latest())
        else:
            self.send_error(404)

    def log_message(self, format, *args):
        # Suppress default logging
        pass


def start_metrics_server(port: int) -> None:
    """Start Prometheus metrics server in a separate thread."""
    def run_server():
        try:
            with socketserver.TCPServer(("", port), MetricsHandler) as httpd:
                logger.info(f"Metrics server started on port {port}")
                httpd.serve_forever()
        except Exception as e:
            logger.error(f"Failed to start metrics server: {e}")
    
    thread = threading.Thread(target=run_server, daemon=True)
    thread.start()


def add_monitoring_middleware(app: FastAPI, settings: Settings) -> None:
    """Add monitoring middleware to FastAPI app."""
    
    @app.middleware("http")
    async def monitoring_middleware(request: Request, call_next: Callable) -> Response:
        # Record start time
        start_time = time.time()
        
        # Increment active connections
        ACTIVE_CONNECTIONS.inc()
        
        try:
            # Process request
            response = await call_next(request)
            
            # Record metrics
            duration = time.time() - start_time
            endpoint = request.url.path
            method = request.method
            status_code = response.status_code
            
            REQUEST_COUNT.labels(
                method=method,
                endpoint=endpoint,
                status_code=status_code
            ).inc()
            
            REQUEST_DURATION.labels(
                method=method,
                endpoint=endpoint
            ).observe(duration)
            
            # Add response headers
            response.headers["X-Response-Time"] = f"{duration:.4f}s"
            
            return response
            
        except Exception as e:
            # Record error metrics
            REQUEST_COUNT.labels(
                method=request.method,
                endpoint=request.url.path,
                status_code=500
            ).inc()
            
            logger.error(f"Request failed: {e}", exc_info=True)
            raise
        
        finally:
            # Decrement active connections
            ACTIVE_CONNECTIONS.dec()
    
    # Start metrics server if enabled
    if settings.ENABLE_METRICS:
        start_metrics_server(settings.METRICS_PORT)


def setup_health_checks(app: FastAPI) -> None:
    """Add health check endpoints."""
    
    @app.get("/health")
    async def health_check():
        """Basic health check endpoint."""
        return {"status": "healthy", "timestamp": time.time()}
    
    @app.get("/health/ready")
    async def readiness_check():
        """Readiness check for Kubernetes."""
        # Add any readiness checks here (database connections, etc.)
        return {"status": "ready", "timestamp": time.time()}
    
    @app.get("/health/live")
    async def liveness_check():
        """Liveness check for Kubernetes."""
        return {"status": "alive", "timestamp": time.time()}
# Movici Viewer

[![CI Pipeline](https://github.com/nginfra/movici-viewer/workflows/CI/badge.svg)](https://github.com/nginfra/movici-viewer/actions)
[![Python 3.8+](https://img.shields.io/badge/python-3.8%20%7C%203.9%20%7C%203.10%20%7C%203.11%20%7C%203.12-blue)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/node.js-18%20%7C%2020-green)](https://nodejs.org/)

**Modern web-based visualization platform for Movici geospatial simulations**

Movici Viewer is a full-stack web application that provides interactive visualization and analysis capabilities for Movici simulation data. It combines a FastAPI backend with a Vue.js frontend to deliver a powerful, user-friendly interface for exploring geospatial simulation results.

## ✨ Features

### 🌍 **Interactive Geospatial Visualization**
- Web-based map interface with multiple basemap options
- Real-time data rendering with deck.gl
- Support for points, lines, polygons, and 3D geometries
- Dynamic styling and color mapping

### 📊 **Data Analysis & Exploration**
- Time-series data visualization
- Interactive charts and graphs
- Data filtering and querying capabilities
- Export functionality for results

### 🚀 **High Performance**
- Python 3.12 backend with FastAPI
- Optimized data streaming
- Efficient caching mechanisms
- Production-ready deployment

### 🔧 **Developer Friendly**
- Modern Vue.js 3 frontend with TypeScript
- RESTful API with OpenAPI documentation
- Docker containerization
- CI/CD pipeline with GitHub Actions

## 🏗️ Architecture

```
movici-viewer/
├── client/              # Vue.js frontend application
│   ├── src/
│   ├── movici-flow-lib/ # Visualization components library (submodule)
│   └── public/
├── server/              # FastAPI backend application
│   ├── movici_viewer/
│   └── tests/
└── nginx/               # Production web server configuration
```

## 📋 Requirements

### System Requirements
- **Python**: 3.8, 3.9, 3.10, 3.11, or 3.12
- **Node.js**: 18.x or 20.x
- **Operating System**: Windows, macOS, or Linux

### System Dependencies

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y libgdal-dev libspatialite7 spatialite-bin
```

**macOS:**
```bash
brew install gdal spatialite
```

**Windows:**
- Install OSGeo4W or use conda-forge packages

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository:**
```bash
git clone --recursive https://github.com/nginfra/movici-viewer.git
cd movici-viewer
```

2. **Start with Docker Compose:**
```bash
docker-compose up -d
```

3. **Access the application:**
- Web Interface: http://localhost
- API Documentation: http://localhost/docs

### Manual Installation

1. **Clone the repository:**
```bash
git clone --recursive https://github.com/nginfra/movici-viewer.git
cd movici-viewer
```

2. **Install backend dependencies:**
```bash
cd server
pip install -e .[dev]
```

3. **Install frontend dependencies:**
```bash
cd ../client
npm install
```

4. **Build the frontend:**
```bash
npm run build
cp -r dist ../server/movici_viewer/ui
```

5. **Run the application:**
```bash
cd ../server
movici-viewer /path/to/your/data --host 0.0.0.0 --port 8000
```

## 📖 Development Setup

### Backend Development

1. **Set up Python environment:**
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .[dev]
```

2. **Run development server:**
```bash
movici-viewer /path/to/test/data --host 0.0.0.0 --port 8000 --allow-cors
```

3. **Run tests:**
```bash
pytest
```

### Frontend Development

1. **Install dependencies:**
```bash
cd client
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Run tests:**
```bash
npm run test
```

4. **Type checking:**
```bash
npm run type-check
```

### Full Stack Development

For development with hot reloading:

1. **Start backend** (terminal 1):
```bash
cd server
movici-viewer /path/to/test/data --host 0.0.0.0 --port 8000 --allow-cors
```

2. **Start frontend** (terminal 2):
```bash
cd client
npm run dev
```

Access the development application at http://localhost:5173

## 🚢 Production Deployment

### Docker Deployment

1. **Build and deploy:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

2. **Configure environment:**
```bash
cp .env.production .env
# Edit .env with your production settings
```

### Manual Deployment

1. **Build frontend:**
```bash
cd client
npm ci
npm run build
```

2. **Deploy backend:**
```bash
cd server
pip install -e .
cp -r ../client/dist movici_viewer/ui
```

3. **Configure web server:**
```bash
# Copy nginx configuration
sudo cp nginx/nginx.conf /etc/nginx/sites-available/movici-viewer
sudo ln -s /etc/nginx/sites-available/movici-viewer /etc/nginx/sites-enabled/
```

### Environment Configuration

Create `.env.production` with your settings:

```bash
MOVICI_FLOW_DATA_DIR=/path/to/data
MOVICI_FLOW_LOG_LEVEL=INFO
MOVICI_FLOW_LOG_FORMAT=json
MOVICI_FLOW_CORS_ORIGINS=https://yourdomain.com
MOVICI_FLOW_ENABLE_METRICS=true
```

## 📊 Monitoring & Observability

### Health Checks
- **Basic**: `GET /health`
- **Readiness**: `GET /health/ready`
- **Liveness**: `GET /health/live`

### Metrics (Prometheus)
When `ENABLE_METRICS=true`, metrics are available at `:9090/metrics`

### Logging
Structured JSON logging in production mode with configurable levels.

## 🧪 Testing

### Backend Tests
```bash
cd server
pytest --cov=movici_viewer --cov-report=html
```

### Frontend Tests
```bash
cd client
npm run test
npm run test:coverage
```

### Integration Tests
```bash
# Requires built frontend
pytest tests/integration/ -v
```

### Performance Tests
```bash
pytest tests/ -k "benchmark" --benchmark-only
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass (`npm test` and `pytest`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines

- **Backend**: Follow PEP 8, use type hints, add docstrings
- **Frontend**: Follow Vue.js style guide, use TypeScript
- **Testing**: Maintain >90% test coverage
- **Documentation**: Update docs for new features

## 📄 License

This project is licensed under the Movici Public License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: https://docs.movici.nl/
- **Issues**: https://github.com/nginfra/movici-viewer/issues
- **Discussions**: https://github.com/nginfra/movici-viewer/discussions
- **Email**: movici@nginfra.nl

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/) and [Vue.js](https://vuejs.org/)
- Geospatial visualization powered by [deck.gl](https://deck.gl/)
- Maps provided by [Mapbox](https://www.mapbox.com/)
- Spatial operations by [movici-simulation-core](https://github.com/nginfra/movici-simulation-core)

---

**Made with ❤️ by the Movici team at NGinfra**
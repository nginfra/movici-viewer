# Movici Viewer Development Makefile
.PHONY: help test lint format clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Backend Python tasks
test: ## Run backend tests
	cd server && python -m pytest -v tests/

coverage: ## Run backend tests with coverage
	cd server && python -m pytest --cov movici_viewer --cov-report=term-missing --cov-report=xml tests/

lint: ## Run backend linting
	cd server && python -m ruff check .
	cd server && python -m black --check .
	cd server && python -m isort --check-only .
	cd server && python -m mypy movici_viewer
	cd server && python -m bandit -c pyproject.toml -r movici_viewer

format: ## Format backend code
	cd server && python -m black .
	cd server && python -m isort .

pre-commit-install: ## Install pre-commit hooks
	cd server && python -m pre_commit install

# Version management
level=patch
export level

bump-version: ## Bump version
	bumpversion  --config-file .bumpversion.app $(level)

ui:
	cd client && npm run build
	rm -rf server/movici_viewer/ui/*
	cp -r client/dist/* server/movici_viewer/ui

build: ui
	cd server && poetry build

pre-init:
	cd client && npm install
	mkdir -p server/movici_viewer/ui

init: pre-init ui
	cd server && poetry install -E dev

data_dir=tests/data
export data_dir

run-devel:
	cd server \
	&& MOVICI_FLOW_DATA_DIR=$(data_dir) \
	   uvicorn --factory movici_viewer.main:get_app --host localhost --port 5000 --reload

run:
	cd server && poetry run movici-viewer

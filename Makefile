level=patch
export level

bump-version:
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
	cd server \
	&& poetry env use python3.10 \
	&& poetry install --extras dev

data_dir=tests/data
port=5000

export data_dir
export port

run-devel:
	cd server \
	&& MOVICI_FLOW_DATA_DIR=$(data_dir) \
	   MOVICI_FLOW_ALLOW_CORS=1 \
	   poetry run uvicorn --factory movici_viewer.main:get_app --host localhost --port $(port) --reload

run-client:
	cd client \
	&& VITE_MOVICI_BASE_URL=http://localhost:$(port) npm run dev
run:
	cd server && poetry run movici-viewer

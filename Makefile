.PHONY: all run

all:
	@echo "Usage: make [OPTION]"
	@echo ""
	@echo "Options:"
	@echo "  run        Run the site code locally"

run:
	@npm run docs:dev

define GetFromPkg
$(shell node -p "require('./package.json').$(1)")
endef

PROJECT      := $(call GetFromPkg,name)
LAST_VERSION := $(call GetFromPkg,version)


.PHONY: up

up:
	git pull origin main
	git add .
	git commit -am "update"
	git push origin main
	@echo "\n 发布中..."

tag:
	git pull 
	git add .
	git commit -am "${PROJECT} ${LAST_VERSION}"
	git push 
	git tag v${LAST_VERSION}
	git push --tags
	@echo "\n tags 发布中..."
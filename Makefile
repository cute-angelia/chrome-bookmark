.PHONY: up

up:
	git pull origin main
	git add .
	git commit -am "update"
	git push origin master
	@echo "\n 发布中..."

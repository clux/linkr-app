bin := $(shell npm bin)

.PHONY: assets
assets:
	mkdir -p assets/js assets/css assets/images assets/html
	cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js
	$(bin)/vulcanize components.html > assets/html/components.html
	cp app/main.js assets/js/main.js

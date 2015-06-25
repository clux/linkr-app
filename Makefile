bin := $(shell npm bin)

.PHONY: assets
assets:
	mkdir -p assets/js assets/css assets/images assets/html
	cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js
	$(bin)/vulcanize --inline-scripts app/routing.html > app/routing.build.html
	$(bin)/vulcanize app/elements.html > assets/html/components.html
	rm app/routing.build.html
	cp app/main.js assets/js/main.js

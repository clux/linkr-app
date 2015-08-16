bin := $(shell npm bin)

.PHONY: assets
assets:
	mkdir -p assets/js assets/css assets/images assets/html
	cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js
	$(bin)/browserify app/main.js > assets/js/main.js
	$(bin)/uglify -s assets/js/main.js -o assets/js/main.min.js
	$(bin)/vulcanize app/elements.html > assets/html/components.html

assets:
	mkdir -p assets/js assets/css assets/images assets/html
	vulcanize components.html > assets/html/components.html
	cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js

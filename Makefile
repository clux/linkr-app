wc:
	mkdir -p assets/js assets/css assets/images assets/html
	vulcanize components.html > assets/html/components.html
	cp bower_components/webcomponentsjs/webcomponents-lite.* assets/js

release:
	make js css html; sed -i 's/\.\/bower_components/../g' icebreaker.build.html

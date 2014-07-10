component = ./node_modules/.bin/component
component-testem = ./node_modules/.bin/component-testem

install: node_modules components

node_modules: package.json
	@npm install

components: component.json
	@$(component) install --dev

clean:
	@rm -rf build components

test: install $(wildcard test/*.js)
	@$(component-testem)

test-server:
	@$(component-testem) --server

build:
	@$(component) build --standalone storage --out . --name storage

release: build
	@echo - upgrade versions in package.json, component.json, bower.json
	@echo - upgrade History.md and commit
	@echo - create tag: git tag 0.0.0
	@echo - push to github
	@echo - npm publish

stat:
	@cloc index.js --quiet --by-file
	@cloc test/ --quiet --by-file

stat-components: components
	@cloc components/ --by-file --exclude-dir=components/chaijs

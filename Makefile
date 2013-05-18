.PHONY: test
.IGNORE: test

BIN = ./node_modules/.bin
JISON        = $(BIN)/jison
BROWSERBUILD = $(BIN)/browserbuild
UGLIFYJS     = $(BIN)/uglifyjs

SOURCES = $(wildcard src/tea/*.tea) $(wildcard src/tea/**/*.tea)
OBJECTS = $(patsubst src/tea/%.tea, lib/%.js, $(SOURCES))

all: lib/parser.js $(OBJECTS)

lib/%.js: src/tea/%.tea
	bin/tea $< -o $@

lib/parser.js: src/tea.y src/tea.l
	$(JISON) -m js src/tea.y src/tea.l -o lib/_parser.js
	echo "var Tea = require('./tea');" > $@
	cat lib/_parser.js >> $@
	echo "module.exports = _parser;" >> $@
	rm lib/_parser.js

test: all
	cd test && node all.js `find * -iname "*_test.js"`
#	cd test && narwhal all.js `find * -iname "*_test.js"`
#	cd test && gjs all.js `find * -iname "*_test.js"`     # GJS doesn't support commonjs require natively :(
#	cd test && seed all.js `find * -iname "*_test.js"`    # what about seed?

browser: all
	$(BROWSERBUILD) -g Tea -b lib/,vendor/ -m tea $(OBJECTS) lib/parser.js vendor/js-beautify.js | $(UGLIFYJS) > tea-script.js


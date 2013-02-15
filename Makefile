.PHONY: test
.IGNORE: test

parser:
	jison src/tea.jison src/tea.jisonlex -o lib/parser.js

all: parser

test:
	cd test && node all.js `find * -iname "*_test.js"`
#	cd test && narwhal all.js `find * -iname "*_test.js"`
#	cd test && gjs all.js `find * -iname "*_test.js"`     # GJS doesn't support commonjs require natively :(
#	cd test && seed all.js `find * -iname "*_test.js"`    # what about seed?

SOURCES=$(wildcard src/tea/*.tea) $(wildcard src/tea/**/*.tea)
OBJECTS=$(patsubst src/tea/%.tea,build/%.js,$(SOURCES))

build/%.js: src/tea/%.tea
	bin/tea $< > $@

folders:
	mkdir -p build/types build/expressions build/statements

tea: folders $(OBJECTS)


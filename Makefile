.PHONY: test
.IGNORE: test

SOURCES=$(filter-out %compile.tea, $(wildcard src/tea/*.tea)) $(wildcard src/tea/**/*.tea)
OBJECTS=$(patsubst src/tea/%.tea,build/%.js,$(SOURCES))

parser: src/tea.jison src/tea.jisonlex
	jison src/tea.jison src/tea.jisonlex -o lib/parser.js

all: parser

build/%.js: src/tea/%.tea
	bin/tea $< > $@

build/parser.js: src/tea.jison src/tea.jisonlex
	jison -m js src/tea.jison src/tea.jisonlex -o build/parser.js

build/tea.js: $(OBJECTS) build/compile.js build/parser.js
	echo "(function () {" > $@
	cat $(OBJECTS) build/parser.js build/compile.js >> $@
	echo "}());" >> $@

folders:
	mkdir -p build/types build/expressions build/statements

tea: folders build/tea.js

test:
	cd test && node all.js `find * -iname "*_test.js"`
#	cd test && narwhal all.js `find * -iname "*_test.js"`
#	cd test && gjs all.js `find * -iname "*_test.js"`     # GJS doesn't support commonjs require natively :(
#	cd test && seed all.js `find * -iname "*_test.js"`    # what about seed?


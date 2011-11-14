parser:
	jison src/tea.jison src/tea.jisonlex -o lib/parser.js

all: parser

test:
	cd test && node all.js `find * -iname "*_test.js"`


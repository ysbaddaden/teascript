parser:
	jison src/tea.jison src/tea.jisonlex -o lib/parser.js

all: parser

test: test/*
	node test/all.js


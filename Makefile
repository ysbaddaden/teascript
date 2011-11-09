tea:
	jison src/tea.jison src/tea.jisonlex -o lib/parser.js

all: tea

test: tea
	lib/tea tests/numbers.tea
	lib/tea tests/strings.tea
	lib/tea tests/arrays.tea
	lib/tea tests/objects.tea
	lib/tea tests/assigns.tea
	lib/tea tests/conditionals.tea
	lib/tea tests/loops.tea


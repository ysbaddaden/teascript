tea:
	jison src/tea.jison src/tea.jisonlex -o lib/tea.js

all: tea

test: tea
	lib/tea tests/numbers.tea
	lib/tea tests/strings.tea
	lib/tea tests/arrays.tea
	lib/tea tests/assigns.tea
	lib/tea tests/conditionals.tea
	lib/tea tests/loops.tea


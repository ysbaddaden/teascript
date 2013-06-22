SOURCES=$(wildcard *.tea)
OBJECTS=$(patsubst %.tea,%.js,$(SOURCES))

%.js: %.tea
	echo "bin/tea $< > $@"

all: $(OBJECTS)


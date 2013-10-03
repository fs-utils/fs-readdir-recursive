BIN = ./node_modules/.bin/

test:
	@${BIN}mocha \
		--reporter spec \
		--require should \
		--bail

clean:
	@rm -rf node_modules

.PHONY: test clean
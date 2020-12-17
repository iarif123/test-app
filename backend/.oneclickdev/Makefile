include .oneclickdev/config.env

.oneclickdev/smartrebuild.o: $(shell echo $(BUILD_DEPS))
	@./ocd build
	@touch $@

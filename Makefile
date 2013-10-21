# Makefile for Wunnel (yoob version).

JAVAC?=javac
JAVA?=java
ifeq ($(OS),Windows_NT)
  PATHSEP=;
else
  PATHSEP=:
endif

JFLAGS?=-Xlint:deprecation -Xlint:unchecked
CDIR=bin/tc/catseye/wunnel
CLASSES=$(CDIR)/WunnelState.class

YOOBDIR?=../yoob
CP?=bin$(PATHSEP)$(YOOBDIR)/bin

all: $(CLASSES)

$(CDIR)/WunnelState.class: src/WunnelState.java
	$(JAVAC) $(JFLAGS) -cp "$(CP)" -d bin src/WunnelState.java

clean:
	rm -rf $(CDIR)/*.class

test: $(CLASSES)
	$(JAVA) -cp "$(CP)" tc.catseye.yoob.GUI -c "tc.catseye.wunnel.WunnelState/Wunnel" -s Wunnel

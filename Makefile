# Makefile for Wunnel (yoob version).

JAVAC?=javac
JAVA?=java
PATHSEP?=:

JFLAGS?=-Xlint:deprecation -Xlint:unchecked
CDIR=bin/tc/catseye/wunnel
CLASSES=$(CDIR)/WunnelState.class

YOOBDIR?=../yoob
CLASSPATH?=bin$(PATHSEP)$(YOOBDIR)/bin

all: $(CLASSES)

$(CDIR)/WunnelState.class: src/WunnelState.java
	$(JAVAC) $(JFLAGS) -cp "$(CLASSPATH)" -d bin src/WunnelState.java

clean:
	rm -rf $(CDIR)/*.class

test: $(CLASSES)
	$(JAVA) -cp "$(CLASSPATH)" tc.catseye.yoob.GUI -c "tc.catseye.wunnel.WunnelState/Wunnel" -s Wunnel

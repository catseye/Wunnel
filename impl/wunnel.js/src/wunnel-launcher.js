function launch(prefix, container, config) {
  if (typeof container === 'string') {
    container = document.getElementById(container);
  }
  config = config || {};
  var deps = [
    "yoob/element-factory.js",
    "yoob/playfield.js",
    "yoob/playfield-html-view.js",
    "yoob/cursor.js",
    "yoob/tape.js",
    "yoob/tape-html-view.js",
    "yoob/controller.js",
    "yoob/source-manager.js",
    "yoob/preset-manager.js",
    "wunnel.js"
  ];
  var loaded = 0;
  var onload = function() {
    if (++loaded < deps.length) return;
    /* ----- launch, phase 1: create the UI ----- */
    var controlPanel = yoob.makeDiv(container);
    controlPanel.id = "panel_container";

    var subPanel = yoob.makeDiv(container);
    var selectSource = yoob.makeSelect(subPanel, 'example source:', []);

    var displayContainer = yoob.makeDiv(container);
    displayContainer.id = 'display_container';

    var programDisplay = yoob.makePre(displayContainer);
    programDisplay.id = 'program_display';

    var editor = yoob.makeTextArea(displayContainer, 40, 25);

    var stateDisplay = yoob.makeDiv(displayContainer);
    stateDisplay.id = "state_display";

    var opTableDisplay = yoob.makePre(stateDisplay);
    opTableDisplay.id = 'op_table_display';

    var tapeSubDisplay = yoob.makeDiv(stateDisplay);
    yoob.makeSpan(tapeSubDisplay, "Tape:");
    var tapeDisplay = yoob.makeSpan(tapeSubDisplay);

    var ioSubDisplay = yoob.makeDiv(stateDisplay);
    ioSubDisplay.innerHTML = 'Input: <input id="input"></input><br />' +
                             'Output: <div id="output">';

    var programView = new yoob.PlayfieldHTMLView().init({
      element: programDisplay
    });
    var opTableView = new yoob.PlayfieldHTMLView().init({
      element: opTableDisplay
    });
    opTableView.render = function(value) {
          return ' ' + value + ' ';
    };
    var tapeView = new yoob.TapeHTMLView().init({
      element: tapeDisplay
    });

    /* ----- launch, phase 2: connect the controller ----- */
    var WunnelController = getWunnelControllerClass();
    var controller = (new WunnelController()).init({
        programView: programView,
        opTableView: opTableView,
        tapeView: tapeView,
        inputElem: document.getElementById("input"),
        outputElem: document.getElementById("output"),
        panelContainer: controlPanel
    });

    var sourceManager = (new yoob.SourceManager()).init({
        panelContainer: controlPanel,
        editor: editor,
        hideDuringEdit: [programDisplay],
        disableDuringEdit: [controller.panel],
        storageKey: 'wunnel.js',
        onDone: function() {
            controller.performReset(this.getEditorText());
        }
    });
    var p = (new yoob.PresetManager()).init({
      selectElem: selectSource,
      controller: controller
    });
    function makeCallback(sourceText) {
      return function(id) {
        sourceManager.loadSource(sourceText);
      }
    }
    for (var i = 0; i < examplePrograms.length; i++) {
      p.add(examplePrograms[i][0], makeCallback(examplePrograms[i][1]));
    }
    p.select(examplePrograms[0][0]);
  };
  for (var i = 0; i < deps.length; i++) {
    var elem = document.createElement('script');
    elem.src = prefix + deps[i];
    elem.onload = onload;
    document.body.appendChild(elem);
  }
}

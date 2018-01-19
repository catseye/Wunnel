function launch(prefix, container, config) {
  if (typeof container === 'string') {
    container = document.getElementById(container);
  }
  config = config || {};
  var deps = [
    "yoob/playfield.js",
    "yoob/playfield-html-view.js",
    "yoob/cursor.js",
    "yoob/tape.js",
    "yoob/controller.js",
    "yoob/preset-manager.js",
    "wunnel-controller.js"
  ];
  var loaded = 0;
  var onload = function() {
    if (++loaded < deps.length) return;
    /* ----- launch ----- */
    var programView = new yoob.PlayfieldHTMLView().init(
      null, document.getElementById('program_display')
    );
    var opTableView = new yoob.PlayfieldHTMLView().init(
      null, document.getElementById('op_table_display')
    );
    opTableView.render = function(value) {
          return ' ' + value + ' ';
    };
    var WunnelController = getWunnelControllerClass();
    var c = (new WunnelController()).init({
        programView: programView,
        opTableView: opTableView,
        tapeCanvas: document.getElementById("tape_display"),
        inputElem: document.getElementById("input"),
        outputElem: document.getElementById("output")
    });
    c.connect({
      'start': 'start',
      'stop': 'stop',
      'reset': 'reset',
      'step': 'step',
      'load': 'load',
      'edit': 'edit',
      'speed': 'speed',
      'source': 'program',
      'display': 'program_display'
    });
    c.click_load();
    var p = (new yoob.PresetManager()).init({
      selectElem: document.getElementById('select_source'),
      controller: c
    });
    function makeCallback(sourceText) {
      return function(id) {
        c.loadSource(sourceText);
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

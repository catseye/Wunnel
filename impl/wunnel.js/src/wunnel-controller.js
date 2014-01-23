/*
 * requires yoob.Controller
 * requires yoob.Playfield
 * requires yoob.Cursor
 * requires yoob.Tape
 * ...INCOMPLETE.
 */
function WunnelPlayfield() {
    this.setDefault(' ');
    
    this.inBounds = function(x, y) {
        return (x >= this.minX && x <= this.maxX &&
                y >= this.minY && y <= this.maxY);
    };
};
WunnelPlayfield.prototype = new yoob.Playfield();


function WunnelCursor() {
    this.getX = function() { return this.x; }
    this.getY = function() { return this.y; }
    this.setX = function(x) { this.x = x; }
    this.setY = function(y) { this.y = y; }
};
WunnelCursor.prototype = new yoob.Cursor();


function OperationTable() {
    this.init = function() {
        this.clear();
        var table =
          "RRS-+N\n" +
          "<S>0N0\n" +
          ">I<N+-\n" +
          "NOSS<E\n" +
          "SEN>SE\n" +
          "RNRRRR\n";
        var map = {
          'R': 'ROT',
          'S': 'SHU',
          'N': 'NOP',
          '+': 'PLU',
          '-': 'NEG',
          '0': 'BLA',
          '<': 'LEF',
          '>': 'RIG',
          'E': 'END',
          'O': 'OUT',
          'I': 'INP'
        };
        this.load(0, 0, table, function(x) { return map[x] });
    };
};
OperationTable.prototype = new yoob.Playfield();


function OpTableCursor() {
    this.advance = function() {
        this.x += this.dx;
        if (this.x < 0) this.x = 5;
        if (this.x > 5) this.x = 0;
        this.y += this.dy;
        if (this.y < 0) this.y = 5;
        if (this.y > 5) this.y = 0;        
    };
};
OpTableCursor.prototype = new yoob.Cursor();


function WunnelController() {
    var pf;
    var ip;

    var optab;
    var opp;

    var tape;
    var head;

    this.init = function(cfg) {
        this.programView = cfg.programView;
        this.opTableView = cfg.opTableView;
        this.tapeCanvas = cfg.tapeCanvas;
        this.inputElem = cfg.inputElem;
        this.outputElem = cfg.outputElem;

        pf = new WunnelPlayfield();
        ip = new WunnelCursor(0, 0, 1, 1);
        this.programView.pf = pf;
        this.programView.setCursors([ip]);

        optab = new OperationTable();
        optab.init();
        opp = new OpTableCursor(0, 0, 1, 1);
        this.opTableView.pf = optab;
        this.opTableView.setCursors([opp]);

        return this;
    };

    this.positiveGenus = "0689@%&QROPADBqeopadb";

    this.genusMoreThanZero = function(c) {
        for (var i = 0; i < this.positiveGenus.length; i++) {
            if (this.positiveGenus.charAt(i) === c)
                return true;
        }
        return false;
    };

    this.step = function() {
        var instruction = pf.get(ip.x, ip.y);
        var k = optab.get(opp.x, opp.y);

        if (this.genusMoreThanZero(instruction)) {
            if (k === 'END') {
                return 'stop';
            } else if (k === 'NOP') {
            } else if (k === 'SHU') {
                if (ip.isHeaded(-1, 0)) {
                    ip.setY(ip.getY() - tape.get(head));
                } else if (ip.isHeaded(1, 0)) {
                    ip.setY(ip.getY() + tape.get(head));
                } else if (ip.isHeaded(0, -1)) {
                    ip.setX(ip.getX() + tape.get(head));
                } else if (ip.isHeaded(0, 1)) {
                    ip.setX(ip.getX() - tape.get(head));
                }
            } else if (k === 'ROT') {
                ip.rotateCounterclockwise();
                ip.rotateCounterclockwise();
                opp.rotateCounterclockwise();
                opp.rotateCounterclockwise();
            } else if (k === 'LEF') {
                head--;
            } else if (k === 'RIG') {
                head++;
            } else if (k === 'NEG') {
                tape.put(head, -1);
            } else if (k === 'BLA') {
                tape.put(head, 0);
            } else if (k === 'PLU') {
                tape.put(head, 1);
            } else if (k === 'OUT') {
                this.outputElem.innerHTML += (tape.get(head) === 0 ? '0' : '1');
            } else if (k === 'INP') {
                var c = this.inputElem.value;
                if (c === '') {
                    return 'block';
                }
                tape.put(head, c.charAt(0) === '1' ? 1 : 0);
                this.inputElem.value = c.substr(1);
            }
        } else {
            opp.advance();
        }

        ip.advance();
        if (!pf.inBounds(ip.x, ip.y)) {
            return 'stop';
        }

        this.draw();
    };

    this.load = function(text) {
        pf.clear();
        pf.load(0, 0, text);
        ip.x = 0;
        ip.y = 0;
        ip.dx = 0;
        ip.dy = 1;

        opp.x = 0;
        opp.y = 0;
        opp.dx = 0;
        opp.dy = 1;

        tape = new yoob.Tape();
        head = 0;

        this.inputElem.value = "";
        this.outputElem.innerHTML = "";

        this.draw();
    };
    
    this.draw = function() {
        this.programView.draw();
        this.opTableView.draw();
        tape.drawCanvas(this.tapeCanvas, 12, 12, []);
    };
};
WunnelController.prototype = new yoob.Controller();

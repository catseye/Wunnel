/*
 * requires yoob.Controller
 * requires yoob.Playfield
 * requires yoob.Cursor
 * requires yoob.Tape
 * ...VERY INCOMPLETE.
 */
function WunnelPlayfield() {
    this.setDefault(' ');
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
    this.getX = function() { return this.x; }
    this.getY = function() { return this.y; }
    this.setX = function(x) { this.x = x; }
    this.setY = function(y) { this.y = y; }
    
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

    var halted;
    var needsInput;

    this.init = function(cfg) {
        this.programView = cfg.programView;
        this.opTableView = cfg.opTableView;

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
                halted = true;
                return errors;
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
                var i = tape.get(head);
                if (i === 0) {
                    //world.output(new CharacterElement('0'));
                } else {
                    //world.output(new CharacterElement('1'));
                }
            } else if (k === 'INP') {
                var c = '0'; // world.inputCharacter();
                if (c == null) {
                    needsInput = true;
                    return errors;
                }
                if (c === '1') {
                    tape.put(head, 1);
                } else {
                    tape.put(head, 0);
                }
            }
        } else {
            opp.advance();
        }

        ip.advance();
        /*
        if (playfield.hasFallenOffEdge(ip)) {
            halted = true;
        }
        */

        this.programView.draw();
        this.opTableView.draw();

        needsInput = false;
    }

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
        this.programView.draw();
        this.opTableView.draw();
    };
};
WunnelController.prototype = new yoob.Controller();

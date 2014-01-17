/*
 * requires yoob.Controller
 * requires yoob.Playfield
 * requires yoob.Cursor
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


function WunnelController() {
    var pf;
    var ip;
    var opp;
    var tape;
    var head;

    var halted;
    var needsInput;

    this.init = function(view) {
        pf = new WunnelPlayfield();

        ip = new WunnelCursor(0, 0, 1, 1);
        opp = new WunnelCursor(0, 0, 1, 1);

        view.pf = pf;
        this.view = view.setCursors([ip]);

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

        //BasicCursor<CharacterElement> ip = playfield.getCursor(0);
        //BasicCursor<Operation> opp = opTable.getCursor(0);
        //BasicHead<IntegerElement> h = tape.getHead(0);
        var instruction = pf.get(ip.x, ip.y);
        var k = 'BLA'; // operations.get(opp.x, opp.y);

        if (this.genusMoreThanZero(instruction)) {
            if (k === 'END') {
                halted = true;
                return errors;
            } else if (k === 'NOP') {
            } else if (k === 'SHU') {
                if (ip.isHeaded(-1, 0)) {
                    ip.setY(ip.getY() - h.read());
                } else if (ip.isHeaded(1, 0)) {
                    ip.setY(ip.getY() + h.read());
                } else if (ip.isHeaded(0, -1)) {
                    ip.setX(ip.getX() + h.read());
                } else if (ip.isHeaded(0, 1)) {
                    ip.setX(ip.getX() - h.read());
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

        this.view.draw();

        needsInput = false;
    }

    this.load = function(text) {
        pf.clear();
        pf.load(0, 0, text);
        ip.x = 0;
        ip.y = 0;
        ip.dx = 0;
        ip.dy = 1;
        tape = new yoob.Tape();
        head = 0;
        this.view.draw();
    };
};
WunnelController.prototype = new yoob.Controller();

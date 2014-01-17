/*
 * This file is part of yoob.js version 0.6-PRE
 * Available from https://github.com/catseye/yoob.js/
 * This file is in the public domain.  See http://unlicense.org/ for details.
 */
if (window.yoob === undefined) yoob = {};

/*
 * An object representing a pointer (position vector) into two-dimensional
 * Cartesian space (possibly a yoob.Playfield) with a direction vector
 * (that need not be used).
 *
 * A cursor contains a built-in simple view, i.e. it knows how to render
 * itself on a canvas (drawContext method) or in the midst of HTML text
 * (wrapText method).  These methods are used by the playfield view classes.
 * The supplied methods draw basic block cursors in the colour given by
 * the fillStyle attribute, if present, or a light green if it is not set.
 */
yoob.Cursor = function(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;

    this.isHeaded = function(dx, dy) {
        return this.dx === dx && this.dy === dy;
    };

    this.advance = function() {
        this.x += this.dx;
        this.y += this.dy;
    };

    this.rotateClockwise = function() {
        if (this.dx === 0 && this.dy === -1) {
            this.dx = 1; this.dy = -1;
        } else if (this.dx === 1 && this.dy === -1) {
            this.dx = 1; this.dy = 0;
        } else if (this.dx === 1 && this.dy === 0) {
            this.dx = 1; this.dy = 1;
        } else if (this.dx === 1 && this.dy === 1) {
            this.dx = 0; this.dy = 1;
        } else if (this.dx === 0 && this.dy === 1) {
            this.dx = -1; this.dy = 1;
        } else if (this.dx === -1 && this.dy === 1) {
            this.dx = -1; this.dy = 0;
        } else if (this.dx === -1 && this.dy === 0) {
            this.dx = -1; this.dy = -1;
        } else if (this.dx === -1 && this.dy === -1) {
            this.dx = 0; this.dy = -1;
        }
    };

    this.rotateCounterclockwise = function() {
        if (this.dx === 0 && this.dy === -1) {
            this.dx = -1; this.dy = -1;
        } else if (this.dx === -1 && this.dy === -1) {
            this.dx = -1; this.dy = 0;
        } else if (this.dx === -1 && this.dy === 0) {
            this.dx = -1; this.dy = 1;
        } else if (this.dx === -1 && this.dy === 1) {
            this.dx = 0; this.dy = 1;
        } else if (this.dx === 0 && this.dy === 1) {
            this.dx = 1; this.dy = 1;
        } else if (this.dx === 1 && this.dy === 1) {
            this.dx = 1; this.dy = 0;
        } else if (this.dx === 1 && this.dy === 0) {
            this.dx = 1; this.dy = -1;
        } else if (this.dx === 1 && this.dy === -1) {
            this.dx = 0; this.dy = -1;
        }
    };

    /*
     * For HTML views.  Override if you like.
     */
    this.wrapText = function(text) {
        var fillStyle = this.fillStyle || "#50ff50";
        return '<span style="background: ' + fillStyle + '">' +
               text + '</span>';
    };

    /*
     * For canvas views.  Override if you like.
     */
    this.drawContext = function(ctx, x, y, cellWidth, cellHeight) {
        ctx.fillStyle = this.fillStyle || "#50ff50";
        ctx.fillRect(x, y, cellWidth, cellHeight);
    };
}
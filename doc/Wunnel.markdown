Wunnel
======

_Wunnel_ is a two-dimensional esoteric programming language designed by
Chris Pressey (mostly) on February 13, 2011. It is a [turning tarpit]()
which draws from the [1L][] family of languages.  The name is both a pun on
the pronunciation of "1L", and a recursive portmanteau of the words "Wunnel"
and "tunnel" which is used to describe the long sequences of identical
instructions (often Nops) used in Wunnel programs to sync up remote parts of
the program.

[1L]: http://esolangs.org/wiki/1L
[turning tarpit]: http://esolangs.org/wiki/Turning_tarpit

Program Structure
-----------------

(This is the part that is like 1L.)  Instructions are presented in a finite
two-dimensional grid (called the _playfield_).  There is an instruction
pointer (IP); it starts in the upper-left (northwest) corner of the playfield,
travelling down (south).  It may only travel in cardinal directions, one
playfield cell at a time.  If it travels outside the bounds of the playfield,
the program halts.

Storage is done on a tape, unbounded in both directions.  Each cell of the
tape may contain one of the three "sign" integers -1, 0, or 1. Every cell of
the tape is initially zero.  There are also two special registers _ix_ and
_iy_; each of these may hold any value from 0 to 5 inclusive, and are both
initially zero.

There are only two instructions in Wunnel: _zero genus_ and _positive genus_.
(This is where it diverges from 1L a bit.)  Any character which has a genus
of zero represents the genus zero instruction; any character which has a
genus greater than zero represents the positive genus instruction.

### Aside: Character Genus ###

The genus of a character is computed like the topological genus of a shape,
with the following special consideration.  Because a single character may
consist of separate disconnected shapes, the genus of a character is the sum
of the topological geni of each disconnected shape within the character.
For example, the percent sign, as typically rendered, is one genus-zero shape
(the slash) and two genus-one shapes (the circles); thus its character genus
is two.  This also means that blank characters have genus zero, as they are
the sum of an empty set of individual geni.

Having instructions be distinguished by character genus has some implications
for the representation of Wunnel programs.  Unlike most programming
languages, the concrete rendering of the source code affects the
interpretation of the program.  For example, in a "military stencil"
typeface, all characters would have genus zero; a program in this typeface
would have a different meaning from the "same" program rendered in a font
such as Comic Sans.

Implementations may invoke a sort of "topological wimpmode" by accepting
plain text files and asserting that they assume them to be rendered in a font
with such-and-such characteristics.  (We will do similarly in the remainder
of this article by assuming that the reader's font renders blank spaces as
truly blank, and that lower-case "o" renders as a shape with genus one.)
However, a really high-fidelity implementation might wish to accept source
code in a bitmap or vector graphics format instead of plain text to overcome
the fragility of this assumption.

Additionally, the term "symbol" is explicitly avoided in Wunnel because it
doesn't matter what these characters _symbolize_, only how many holes they
have.

Instructions
------------

(This is the turning tarpit part.)  One instruction selects an operation
from a table, and the other instruction executes that operation.  (This is
where it diverges from a conventional turning tarpit.)  The table is
two-dimensional.

The effect of the zero genus instruction depends on which direction the IP
is travelling:

*   North: decrement iy register (mod 6)
*   South: increment iy register (mod 6)
*   East: increment ix register (mod 6)
*   West: decrement ix register (mod 6)

The effect of the positive genus instruction is to use the ix and iy
registers to look up an operation from the following table, and execute it:

    iy    ix=0     ix=1     ix=2     ix=3     ix=4     ix=5
    0     Rotate   Rotate   Shunt    Negitive Posative Nop
    1     Left     Shunt    Right    Blank    Nop      Blank
    2     Right    Input    Left     Nop      Posative Negitive
    3     Nop      Output   Shunt    Shunt    Left     Halt
    4     Shunt    Halt     Nop      Right    Shunt    Halt
    5     Rotate   Nop      Rotate   Rotate   Rotate   Rotate

The meaning of each of these operations is:

*   Halt: cease executing the program.
*   Right: move the tape head right one cell.
*   Left: move the tape head left one cell.
*   Posative: write +1 to the current tape cell.
*   Blank: write 0 to the current tape cell.
*   Negitive: write -1 to the current tape cell.
*   Rotate: rotate the IP's direction of travel 90 degrees counterclockwise.
*   Shunt: alter the left/right position of the IP's line of travel by the
    amount in the current tape cell, where negative values mean to the left.
    For example, if the tape cell contains 1 and the IP is travelling west on
    the 9th row, and shunt is executed, the IP will now be travelling west on
    the 8th row.  If the IP was instead travelling east, it would after
    executing Shunt be travelling east on the 10th row.  If it was travelling
    south in the 10th column, it would change to travelling south in the 9th
    column.
*   Input: accept a single bit (0 or 1) of input and write it to the current
    tape cell.
*   Output: output the absolute value of the current tape cell as a bit.

Examples
--------

A bitwise cat program:

              o   ooo  o
    
    
    o
    o
    o
    o         o
    o         o
    o         o
    o         o
    o
    o        o     o
    o         o
    o
    o        o
    o              o
    o        o     o
    o              o
    
             o
    o oooooooo     o
             o
             o
             o
    
             o    oooo o

Every contiguous line of multiple `o` characters in this example is a wunnel.
All of these wunnels except the horizontal one at the very top execute Nop
repeatedly; the one at the very top executes Posative repeatedly (which has
the same effect as executing Posative only once.)  Note also how two wunnels
overlap at the middle of the source nearer the bottom.

Computational Class
-------------------

The author suspects Wunnel to be Turing-complete.  The above example shows
how Shunt can be used to construct a loop.  In the example, the direction of
the Shunt is fixed, but in general it is conditional.  And although there is
no instruction to alter a cell relative to its current state (say by
incrementing it), it should be possible to use Shunt to select one of three
paths based on the cell's value, alter the tape cell as desired in each of
those paths, and merge back together with another set of Shunts, this time
fixed ones.

The main open question is whether the chosen operation matrix supports an
arbitrary effect at an arbitrary point.  The first version that was tried had
all the Rotate operations arranged in a center diagonal; this restricted the
instruction set to only row 0 and column 0 instead of the entire table.  The
second version put all the Rotate operations on row 5, but it was decided it
was much more convenient for every row and every column to contain at least
one Nop, so a different arrangement of Rotates which still allow every row
and every column to be used, was chosen.  The author is fairly confident that
the current table allows one to access every operation, and that, with
sufficiently long wunnels, they can be executed with sufficient freedom to
construct arbitrary programs.

from hwlib import P, part, SET

INTRO = "[ADDED] The original problem sets have no solutions. These worked solutions were written for this site; every conversion and every Boolean result was checked in code (truth tables and an exact K-map minimizer), and the VHDL was compiled. Compare them with your lecturer's model answers when those are released."

PS1 = SET("ps1", "PS1 · Number system conversions (Ch 2)", "Digital Logic homework for Sep. 4", [
  P(1, "Perform the following number system conversions.", [
    part("(a)", r"$1101011_2 = ?_{16}$", r"$\mathrm{6B}_{16}$",
      r"Group 4 bits from the right: $110\;1011 \to 0110\;1011 = \mathrm{6\;B}$.", "Binary ↔ hex: groups of 4 bits, because $16 = 2^4$."),
    part("(b)", r"$174003_8 = ?_2$", r"$1111100000000011_2$",
      r"Replace each octal digit by 3 bits: $1 \to 001,\ 7 \to 111,\ 4 \to 100,\ 0 \to 000,\ 0 \to 000,\ 3 \to 011$, giving $001\,111\,100\,000\,000\,011$. Drop the leading zeros.",
      "Octal → binary: one digit = 3 bits, because $8 = 2^3$."),
    part("(c)", r"$10100.1101_2 = ?_{16}$", r"$\mathrm{14.D}_{16}$",
      r"Group outward from the point. Whole part: $1\;0100 \to 0001\;0100 = 14$. Fraction: $1101 = \mathrm{D}$.", "Group from the radix point, padding with zeros at the outer ends."),
    part("(d)", r"$\mathrm{F3A5}_{16} = ?_2$", r"$1111001110100101_2$",
      r"$\mathrm{F} \to 1111,\ 3 \to 0011,\ \mathrm{A} \to 1010,\ 5 \to 0101$.", "Hex → binary: one digit = 4 bits."),
    part("(e)", r"$101111.0111_2 = ?_8$", r"$57.34_8$",
      r"Whole part: $101\;111 = 5\;7$. Fraction: $011\;1\underline{00} = 3\;4$ (pad with zeros on the RIGHT of a fraction). Check: $57.34_8 = 47 + \frac38 + \frac4{64} = 47.4375 = 101111.0111_2$.",
      "Binary → octal: groups of 3 bits from the point."),
    part("(f)", r"$\mathrm{15C.38}_{16} = ?_2$", r"$101011100.00111_2$",
      r"$1 \to 0001,\ 5 \to 0101,\ \mathrm{C} \to 1100\ .\ 3 \to 0011,\ 8 \to 1000$, so $0001\,0101\,1100.0011\,1000$. Drop the leading and trailing zeros.",
      "Hex → binary digit by digit."),
  ]),
  P(2, "Convert the following numbers into decimal.", [
    part("(a)", r"$1101011_2$", r"$107$", r"$64 + 32 + 8 + 2 + 1 = 107$.", "Radix $r$ → decimal: multiply each digit by its weight $r^i$ and add."),
    part("(b)", r"$174003_8$", r"$63491$",
      r"$1\cdot8^5 + 7\cdot8^4 + 4\cdot8^3 + 0 + 0 + 3 = 32768 + 28672 + 2048 + 3 = 63491$.", "Weights are powers of 8."),
    part("(c)", r"$10100.1101_2$", r"$20.8125$",
      r"Whole: $16 + 4 = 20$. Fraction: $\frac12 + \frac14 + \frac1{16} = 0.8125$.", "Digits after the point have weights $2^{-1}, 2^{-2}, \ldots$"),
    part("(d)", r"$\mathrm{F3A5}_{16}$", r"$62373$",
      r"$15\cdot4096 + 3\cdot256 + 10\cdot16 + 5 = 61440 + 768 + 160 + 5 = 62373$.", r"Weights are powers of 16; $\mathrm{A} = 10$, $\mathrm{F} = 15$."),
    part("(e)", r"$12010_3$", r"$138$",
      r"$1\cdot81 + 2\cdot27 + 0\cdot9 + 1\cdot3 + 0 = 81 + 54 + 3 = 138$. (The handout prints this as “120103”: the subscript 3 was lost.)",
      "Same rule for any radix, here $r = 3$."),
    part("(f)", r"$\mathrm{15C.38}_{16}$", r"$348.21875$",
      r"Whole: $1\cdot256 + 5\cdot16 + 12 = 348$. Fraction: $\frac3{16} + \frac8{256} = 0.1875 + 0.03125 = 0.21875$.", "Negative powers of 16 after the point."),
  ]),
], intro=INTRO)

PS2 = SET("ps2", "PS2 · Switching algebra and canonical sums (Ch 4)", "Digital Logic homework for Sep. 11", [
  P(1, "Prove the following equations using switching algebra.", [
    part("(a)", r"$BC + D + D'(B' + C')(AD + B) = B + D$", "Proved: both sides equal $B + D$.",
      r"First, $D'(AD + B) = AD'D + BD' = BD'$ (since $D'D = 0$). The last term becomes $BD'(B' + C') = BB'D' + BC'D' = BC'D'$. "
      r"So the left side is $BC + D + BC'D'$. Now $D + D'(BC') = D + BC'$ (theorem $X + X'Y = X + Y$). "
      r"Then $BC + BC' + D = B(C + C') + D = B + D$. ∎",
      "Expand the product, kill terms with $XX' = 0$, then combine with $X + X'Y = X + Y$ and $XY + XY' = X$."),
    part("(b)", r"$AB + A'C + (B' + C')D = AB + A'C + D$", "Proved.",
      r"By DeMorgan, $(B' + C') = (BC)'$. By consensus, $AB + A'C = AB + A'C + BC$, so the left side is $AB + A'C + BC + (BC)'D$. "
      r"Since $X + X'D = X + D$ with $X = BC$: $= AB + A'C + BC + D$. Remove the consensus term $BC$ again: $= AB + A'C + D$. ∎",
      "Add a consensus term to create an $X + X'Y$ pattern, then remove it again."),
  ]),
  P(2, "Use switching-algebra theorems to simplify each function.", [
    part("(a)", r"$F = A + ABC + AB'C' + CB + C'B'$", r"$F = A + BC + B'C'$  (that is, $A + (B \oplus C)'$)",
      r"Covering ($X + XY = X$): $A + ABC + AB'C' = A$. What's left is $A + BC + B'C'$, and $BC + B'C'$ is the XNOR of $B$ and $C$.",
      "Covering removes every term that already contains $A$."),
    part("(b)", r"$F = (AB + A'B' + A'B + AB')'$", r"$F = 0$",
      r"$AB + AB' = A$ and $A'B + A'B' = A'$, so the inside is $A + A' = 1$ and $F = 1' = 0$. (The four terms are all four minterms of $A, B$.)",
      "Combining theorem $XY + XY' = X$, then $X + X' = 1$."),
  ]),
  P(3, "Write the canonical sum from the shorthand.", [
    part("(1)", r"$F = \Sigma_{X,Y}(1, 2)$", r"$F = X'Y + XY'$  $(= X \oplus Y)$",
      r"Row 1 = 01 → $X'Y$; row 2 = 10 → $XY'$.", "Write each row number in binary; complement the variables that are 0."),
    part("(2)", r"$F = \Sigma_{A,B,C}(1, 2, 4, 6)$", r"$F = A'B'C + A'BC' + AB'C' + ABC'$",
      r"$1 = 001 \to A'B'C$, $2 = 010 \to A'BC'$, $4 = 100 \to AB'C'$, $6 = 110 \to ABC'$. "
      r"(Not asked, but it simplifies to $A'B'C + BC' + AC'$.)",
      "Canonical sum = OR of the minterms, each containing every variable."),
  ]),
], intro=INTRO)

PS3 = SET("ps3", "PS3 · Karnaugh maps (Ch 4)", "Digital Logic homework for Sep. 18", [
  P(1, "Use Karnaugh maps to find a minimal sum of products.", [
    part("(a)", r"$F = \Sigma_{x,y,z}(1, 3, 5, 6, 7)$", r"$F = z + xy$",
      r"Cells 1, 3, 5, 7 all have $z = 1$: one group of 4 → $z$. Cell 6 (110) pairs with 7 (111) → $xy$. Two groups cover every 1.",
      "Make each group as large as possible (a power of 2), and use as few groups as possible."),
    part("(b)", r"$F = \Sigma_{w,x,y,z}(1, 4, 5, 6, 7, 9, 14, 15)$", r"$F = w'x + xy + x'y'z$",
      r"4, 5, 6, 7 (row $w'x$) → $w'x$. 6, 7, 14, 15 (column $xy$) → $xy$. 1 (0001) and 9 (1001) differ only in $w$ → $x'y'z$. "
      r"The exact minimizer confirms this is the only minimal sum (3 terms, 7 literals).",
      "Look for the groups of 4 first; then cover the leftovers with the largest group that contains them."),
  ]),
  P(2, "Use Karnaugh maps to find a minimal sum of products; d(…) are don't-cares.", [
    part("(a)", r"$F = \Sigma_{w,x,y,z}(0, 1, 2, 8, 11) + d(3, 9, 15)$", r"$F = x'y' + w'x' + x'z$",
      r"$0, 1, 8, 9_d \to x'y'$ (group of 4 using $d$9). $0, 1, 2, 3_d \to w'x'$. "
      r"$1, 3_d, 9_d, 11 \to x'z$ (the only way to put 11 in a group of 4). $d$15 is not needed.",
      "Use a don't-care only when it makes a group bigger; never cover a group of only d's."),
    part("(b)", r"$F = \Sigma_{A,B,C,D}(1, 5, 12, 13, 14, 15) + d(7, 9)$", r"$F = AB + C'D$",
      r"12, 13, 14, 15 → $AB$. $1, 5, 9_d, 13 \to C'D$ (using $d$9). $d$7 is left as 0.",
      "Don't-cares let two groups of 4 replace smaller ones."),
  ]),
], intro=INTRO)

PS4_VHDL = r"""library IEEE;
use IEEE.std_logic_1164.all;

entity full_adder is
  port ( X, Y, CIN: in STD_LOGIC;
         S, COUT:   out STD_LOGIC );
end full_adder;

architecture full_adder_s of full_adder is
  signal X_xor_Y, X_CIN, Y_CIN, X_Y: STD_LOGIC;
  component XOR2 port (I0, I1: in STD_LOGIC; O: out STD_LOGIC); end component;
  component AND2 port (I0, I1: in STD_LOGIC; O: out STD_LOGIC); end component;
  component OR3  port (I0, I1, I2: in STD_LOGIC; O: out STD_LOGIC); end component;
begin
  U1: XOR2 port map (X, Y, X_xor_Y);
  U2: AND2 port map (X, CIN, X_CIN);
  U3: AND2 port map (Y, CIN, Y_CIN);
  U4: AND2 port map (X, Y, X_Y);
  U5: XOR2 port map (X_xor_Y, CIN, S);
  U6: OR3  port map (X_CIN, Y_CIN, X_Y, COUT);
end full_adder_s;"""

PS4 = SET("ps4", "PS4 · Structural VHDL (Ch 5)", "Digital Logic homework for Oct. 9", [
  P(1, "Write a structural VHDL program (entity and architecture) for the full-adder circuit in the figure.", [
    part("", "Write the entity and the structural architecture.",
      "One entity (inputs X, Y, CIN; outputs S, COUT) and an architecture with six component instances U1–U6 matching the figure.",
      "```\n" + PS4_VHDL + "\n```\n"
      "Reading the figure: U1 is an XOR of X and Y (signal X_xor_Y); U2, U3, U4 are ANDs making X_CIN, Y_CIN, X_Y; U5 XORs X_xor_Y with CIN to give S; U6 is a 3-input OR giving COUT. "
      "Each internal wire becomes a signal, and each gate becomes a component instance wired with port map. "
      "XOR2, AND2 and OR3 are library gates (as on the slides with UNISIM); to simulate on your own, give each a one-line entity such as O <= I0 xor I1;. "
      "The code was compiled and simulated for all 8 input rows: S = X ⊕ Y ⊕ CIN and COUT = XY + X·CIN + Y·CIN.",
      "Structural = one component instance per gate in the schematic, one signal per internal wire. The slides' dataflow solution (p60) is the same circuit written with expressions instead.")
  ], fig="homework/img/ps4-p1.png"),
], intro=INTRO)

PS5 = SET("ps5", "PS5 · PLDs and decoders (Ch 6)", "Digital Logic homework for Oct. 23", [
  P(1, r"Simplify and implement with a PLD; draw the circuit in compact representation. $F_1 = A'BCD + AC'D' + B'CD$, $F_2 = A'B + AB' + C'D + CD'$, $F_3 = (A + B + CD)(A' + B + C' + D) + A'B'C'$.", [
    part("(a)", r"Simplify $F_1$.", r"$F_1 = A'CD + B'CD + AC'D'$",
      r"Minterms: $A'BCD = 7$, $AC'D' = 8, 12$, $B'CD = 3, 11$, so $F_1 = \Sigma(3, 7, 8, 11, 12)$. On the K-map, 3 and 7 pair → $A'CD$; 3 and 11 pair → $B'CD$; 8 and 12 pair → $AC'D'$. "
      r"(Algebraically: $A'BCD + B'CD = CD(A'B + B') = CD(A' + B')$, which expands to $A'CD + B'CD$.)",
      "K-map on the minterm list; 15 is not in $F_1$, so $CD$ alone can't be used."),
    part("(b)", r"Simplify $F_2$.", r"$F_2 = A'B + AB' + C'D + CD'$  $(= A \oplus B + C \oplus D)$",
      r"It is already minimal: each pair is an XOR, and the K-map (12 ones, zeros only at 0, 3, 12, 15) has no group of 4 or 8, so it needs four groups of 2.",
      "Check minimality with the K-map before 'simplifying' further."),
    part("(c)", r"Simplify $F_3$.", r"$F_3 = B + C' + D$",
      r"Use $(X + B)(Y + B) = B + XY$ with $X = A + CD$, $Y = A' + C' + D$: $XY = AC' + AD + A'CD + CD = AC' + AD + CD$. "
      r"So $F_3 = B + AC' + AD + CD + A'B'C'$. Since $B + B'(A'C') = B + A'C'$: $F_3 = B + AC' + A'C' + AD + CD = B + C' + AD + CD$. "
      r"Then $C' + CD = C' + D$, and $D$ covers $AD$: $F_3 = B + C' + D$. Check: $F_3 = 0$ only for $B = 0, C = 1, D = 0$ (minterms 2 and 10).",
      "Factor the common $B$ out of the product of sums first, then use $X + X'Y = X + Y$ twice."),
    part("(d)", "Draw the PLA in compact representation.", "4 inputs, 10 product terms, 3 outputs (figure).",
      r"Each row of the AND array is one product term; a dot means 'this literal is connected'. Each column of the OR array is one output; a dot means 'this term is ORed in'. "
      r"$F_1$ uses $A'CD, B'CD, AC'D'$; $F_2$ uses $A'B, AB', C'D, CD'$; $F_3$ uses the one-literal terms $B, C', D$. No term is shared here, so a PAL would work just as well.",
      "Compact (dot) notation from Ch 6: draw only the connections you keep.", fig="homework/img/ps5-pla.svg"),
  ]),
  P(2, "Implement each function using a 4-to-16 decoder (active-low outputs, like the 74x154) and NAND gates.", [
    part("(1)", r"$F(A,B,C,D) = \Sigma(0, 4, 5, 8, 12, 13, 14)$", r"One 7-input NAND of $\overline{Y_0}, \overline{Y_4}, \overline{Y_5}, \overline{Y_8}, \overline{Y_{12}}, \overline{Y_{13}}, \overline{Y_{14}}$",
      r"Inputs $A, B, C, D$ drive the decoder's select inputs ($A$ = MSB). Each active-low output $\overline{Y_i}$ is 0 exactly for minterm $i$. "
      r"$F = Y_0 + Y_4 + \cdots + Y_{14} = (\overline{Y_0}\cdot\overline{Y_4}\cdots\overline{Y_{14}})'$ by DeMorgan, which is a NAND of those outputs.",
      "Decoder = minterm generator; OR of active-low lines = NAND."),
    part("(2)", r"$F(A,B,C,D) = A'BCD + AC'D' + B'CD$", r"$F = \Sigma(3, 7, 8, 11, 12)$: a 5-input NAND of $\overline{Y_3}, \overline{Y_7}, \overline{Y_8}, \overline{Y_{11}}, \overline{Y_{12}}$",
      r"First expand to a canonical sum: $A'BCD = 7$; $AC'D' \to 8, 12$; $B'CD \to 3, 11$. Then NAND the matching decoder outputs, exactly as in (1).",
      "Always convert to minterms first; the decoder can't use a simplified form."),
  ]),
], intro=INTRO)

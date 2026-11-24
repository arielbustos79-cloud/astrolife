import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import React from "react";
import type { CarruselData } from "@/app/api/content/carrusel/route";

// ─── Font cache (module-level, persists across warm invocations) ──────────────
const cache = new Map<string, ArrayBuffer>();

async function loadFont(filename: string): Promise<ArrayBuffer> {
  if (cache.has(filename)) return cache.get(filename)!;
  const buf = await readFile(join(process.cwd(), "public", "fonts", filename));
  const ab = new ArrayBuffer(buf.length);
  new Uint8Array(ab).set(buf);
  cache.set(filename, ab);
  return ab;
}

async function getFonts() {
  const [inter, interItalic, interBold, playfairReg, playfairBold, symbols2, symbolsZodiac] = await Promise.all([
    loadFont("inter-regular.ttf"),
    loadFont("inter-italic.ttf"),
    loadFont("inter-bold.ttf"),
    loadFont("playfair-regular.ttf"),
    loadFont("playfair-bold.ttf"),
    loadFont("noto-symbols2.ttf"),   // has ✦ U+2726
    loadFont("noto-symbols.ttf"),    // has zodiac U+2648-U+2653 (monochrome, no COLR)
  ]);
  return [
    { name: "Playfair Display", data: playfairReg, weight: 400 as const, style: "normal" as const },
    { name: "Playfair Display", data: playfairBold, weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: inter, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: interItalic, weight: 400 as const, style: "italic" as const },
    { name: "Inter", data: interBold, weight: 700 as const, style: "normal" as const },
    { name: "Noto Sans Symbols 2", data: symbols2, weight: 400 as const, style: "normal" as const },
    { name: "Noto Sans Symbols", data: symbolsZodiac, weight: 400 as const, style: "normal" as const },
  ];
}

function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(" ", max);
  return (cut > 0 ? text.slice(0, cut) : text.slice(0, max)) + "…";
}

// ─── Zodiac glyph paths (extracted from Noto Sans Symbols TTF) ───────────────
// Using inline SVG paths bypasses satori's emoji interceptor entirely.
const ZODIAC: Record<string, { d: string; viewBox: string }> = {
  "♈": { d: "M500 1480 L430 1480 L430 992 Q430 908 389.5 862 Q349 816 276 816 L276 816 Q232 816 197 837.5 Q162 859 142 895.5 Q122 932 122 979 L122 979 Q122 1022 141 1056 Q160 1090 192.5 1110 Q225 1130 265 1130 L265 1130 L265 1190 Q203 1190 154.5 1163 Q106 1136 78.5 1088.5 Q51 1041 51 979 L51 979 Q51 912 79 862 Q107 812 158 783.5 Q209 755 276 755 L276 755 Q350 755 396 788 Q442 821 465 893 L465 893 Q488 821 534.5 788 Q581 755 654 755 L654 755 Q721 755 771.5 783.5 Q822 812 850.5 862 Q879 912 879 979 L879 979 Q879 1041 851.5 1088.5 Q824 1136 776 1163 Q728 1190 665 1190 L665 1190 L665 1130 Q706 1130 738.5 1110 Q771 1090 789.5 1056 Q808 1022 808 979 L808 979 Q808 932 788 895 Q768 858 733.5 837 Q699 816 654 816 L654 816 Q581 816 540.5 862.5 Q500 909 500 992 L500 992 L500 1480 Z", viewBox: "51 755 828 725" },
  "♉": { d: "M435 1493 L435 1493 Q382 1493 335 1472.5 Q288 1452 252.5 1416.5 Q217 1381 196.5 1334 Q176 1287 176 1234 L176 1234 Q176 1187 191.5 1145 Q207 1103 236 1068 Q265 1033 305 1010 L305 1010 Q272 988 246.5 961 Q221 934 204 900 L204 900 Q181 855 162 833 Q143 811 118 804 Q93 797 51 797 L51 797 L51 736 Q96 736 135.5 741 Q175 746 203 775 L203 775 Q217 789 229 805.5 Q241 822 251 842 L251 842 Q271 880 296 913.5 Q321 947 356 961 L356 961 Q393 975 435 975 L435 975 Q476 975 513.5 958 Q551 941 576 909 L576 909 Q589 892 600 875.5 Q611 859 620 841 L620 841 Q638 805 668 775 Q698 745 738 741 L738 741 Q758 739 778.5 737.5 Q799 736 819 736 L819 736 L819 797 Q778 797 753 804 Q728 811 709 832.5 Q690 854 667 899 L667 899 Q650 932 624 959.5 Q598 987 564 1010 L564 1010 Q605 1033 634 1068 Q663 1103 678.5 1145 Q694 1187 694 1234 L694 1234 Q694 1288 673.5 1335 Q653 1382 617.5 1417.5 Q582 1453 535 1473 Q488 1493 435 1493 Z M435 1419 L435 1419 Q486 1419 528 1394 Q570 1369 595 1326.5 Q620 1284 620 1234 L620 1234 Q620 1183 595 1141 Q570 1099 528 1074 Q486 1049 435 1049 L435 1049 Q385 1049 342.5 1074 Q300 1099 275 1141 Q250 1183 250 1234 L250 1234 Q250 1284 275 1326.5 Q300 1369 342.5 1394 Q385 1419 435 1419 Z", viewBox: "51 736 768 757" },
  "♊": { d: "M51 1546 L51 1546 L51 1484 Q84 1471 118 1461 Q152 1451 187 1444 L187 1444 L187 817 Q145 808 111 798 Q77 788 51 777 L51 777 L51 715 Q132 748 225.5 764.5 Q319 781 425 781 L425 781 Q637 781 799 715 L799 715 L799 777 Q741 802 663 818 L663 818 L663 1444 Q698 1451 731.5 1461 Q765 1471 799 1484 L799 1484 L799 1546 Q708 1511 618.5 1495.5 Q529 1480 425 1480 L425 1480 Q324 1480 233.5 1495.5 Q143 1511 51 1546 Z M257 831 L257 1431 Q297 1424 339 1421 Q381 1418 425 1418 L425 1418 Q469 1418 511 1421 Q553 1424 593 1431 L593 1431 L593 831 Q552 837 509.5 840 Q467 843 425 843 L425 843 Q382 843 340 840 Q298 837 257 831 L257 831 Z", viewBox: "51 715 748 831" },
  "♋": { d: "M258 1162 L258 1162 Q163 1162 107 1113 Q51 1064 51 983 L51 983 Q51 930 76 889 Q101 848 152 821 L152 821 Q203 794 285.5 780 Q368 766 482 766 L482 766 Q550 766 624 777 Q698 788 768 807.5 Q838 827 892 852 L892 852 L892 922 Q803 879 694.5 856.5 Q586 834 482 834 L482 834 Q445 834 416.5 836 Q388 838 368 843 L368 843 Q409 850 437 888 Q465 926 465 983 L465 983 Q465 1064 409 1113 Q353 1162 258 1162 Z M461 1480 L461 1480 Q407 1480 349 1472.5 Q291 1465 235.5 1453 Q180 1441 132.5 1425.5 Q85 1410 51 1394 L51 1394 L51 1324 Q140 1365 246 1388.5 Q352 1412 461 1412 L461 1412 Q501 1412 529.5 1409.5 Q558 1407 575 1403 L575 1403 Q535 1398 506.5 1359.5 Q478 1321 478 1263 L478 1263 Q478 1209 503.5 1169 Q529 1129 575.5 1106.5 Q622 1084 685 1084 L685 1084 Q780 1084 836 1133 Q892 1182 892 1263 L892 1263 Q892 1315 867 1355.5 Q842 1396 792 1424 L792 1424 Q742 1452 659.5 1466 Q577 1480 461 1480 Z M258 1098 L258 1098 Q317 1098 352.5 1067 Q388 1036 388 983 L388 983 Q388 930 352.5 899 Q317 868 258 868 L258 868 Q197 868 162.5 899 Q128 930 128 983 L128 983 Q128 1036 163.5 1067 Q199 1098 258 1098 Z M685 1378 L685 1378 Q746 1378 780.5 1346.5 Q815 1315 815 1263 L815 1263 Q815 1211 781 1179.5 Q747 1148 685 1148 L685 1148 Q624 1148 589.5 1179.5 Q555 1211 555 1263 L555 1263 Q555 1315 590 1346.5 Q625 1378 685 1378 Z", viewBox: "51 766 841 714" },
  "♌": { d: "M619 1702 L619 1702 Q553 1702 514.5 1660 Q476 1618 476 1544 L476 1544 Q476 1497 491.5 1440.5 Q507 1384 536 1317 L536 1317 Q565 1249 580 1184 Q595 1119 595 1055 L595 1055 Q595 987 572 937.5 Q549 888 509.5 861 Q470 834 419 834 L419 834 Q344 834 298.5 884 Q253 934 253 1021 L253 1021 Q253 1043 256 1063.5 Q259 1084 264 1102 L264 1102 Q311 1108 347 1135 Q383 1162 404 1201.5 Q425 1241 425 1287 L425 1287 Q425 1338 399.5 1380.5 Q374 1423 332 1448.5 Q290 1474 238 1474 L238 1474 Q187 1474 144.5 1448.5 Q102 1423 76.5 1380.5 Q51 1338 51 1287 L51 1287 Q51 1245 68 1208.5 Q85 1172 116 1145 Q147 1118 188 1107 L188 1107 Q182 1087 179 1066 Q176 1045 176 1022 L176 1022 Q176 948 207 890.5 Q238 833 294 799.5 Q350 766 424 766 L424 766 Q499 766 555 801.5 Q611 837 641.5 901 Q672 965 672 1052 L672 1052 Q672 1096 666.5 1141.5 Q661 1187 645 1241.5 Q629 1296 599 1368 L599 1368 Q577 1422 565.5 1466 Q554 1510 554 1543 L554 1543 Q554 1583 575 1605 Q596 1627 630 1627 L630 1627 Q647 1627 661.5 1623.5 Q676 1620 688 1613 L688 1613 L712 1678 Q691 1690 668 1696 Q645 1702 619 1702 Z M238 1398 L238 1398 Q268 1398 293.5 1383 Q319 1368 334 1342.5 Q349 1317 349 1287 L349 1287 Q349 1257 334 1231.5 Q319 1206 293.5 1191 Q268 1176 238 1176 L238 1176 Q209 1176 183.5 1191.5 Q158 1207 142.5 1232 Q127 1257 127 1287 L127 1287 Q127 1317 142 1342 Q157 1367 182.5 1382.5 Q208 1398 238 1398 Z", viewBox: "51 766 661 936" },
  "♍": { d: "M690 1687 L615 1687 Q596 1671 581 1642 Q566 1613 557 1571 L557 1571 Q518 1592 480 1605.5 Q442 1619 404 1625 L404 1625 L404 1561 Q442 1555 477.5 1542 Q513 1529 547 1509 L547 1509 Q546 1493 545 1476.5 Q544 1460 544 1442 L544 1442 L544 948 Q544 912 536 875.5 Q528 839 514 817 L514 817 Q503 826 487.5 845.5 Q472 865 456 889.5 Q440 914 425.5 939 Q411 964 401.5 985 Q392 1006 390 1018 L390 1018 L390 1480 L320 1480 L320 963 Q320 926 313 889 Q306 852 290 817 L290 817 Q279 826 263.5 845.5 Q248 865 232 889.5 Q216 914 201.5 939 Q187 964 177.5 985 Q168 1006 166 1018 L166 1018 L166 1480 L96 1480 L96 955 Q96 931 91 902.5 Q86 874 76 839.5 Q66 805 51 766 L51 766 L104 766 Q118 788 132.5 822.5 Q147 857 160 905 L160 905 Q169 888 187.5 862 Q206 836 227 809.5 Q248 783 266 766 L266 766 L325 766 Q343 792 359.5 832.5 Q376 873 382 905 L382 905 Q391 887 410 861.5 Q429 836 451.5 810 Q474 784 492 766 L492 766 L551 766 Q585 812 599.5 857 Q614 902 614 952 L614 952 L614 1035 Q627 1009 651 980 Q675 951 695 935 L695 935 L753 935 Q782 969 799.5 1030.5 Q817 1092 817 1167 L817 1167 Q817 1239 794.5 1305.5 Q772 1372 728.5 1429 Q685 1486 621 1532 L621 1532 Q628 1577 644 1614.5 Q660 1652 690 1687 L690 1687 Z M614 1141 L614 1460 Q657 1423 686.5 1377 Q716 1331 731.5 1277.5 Q747 1224 747 1167 L747 1167 Q747 1108 739 1063 Q731 1018 715 986 L715 986 Q703 998 687.5 1018.5 Q672 1039 657.5 1062 Q643 1085 631.5 1106 Q620 1127 614 1141 L614 1141 Z", viewBox: "51 766 766 921" },
  "♎": { d: "M422 1247 L51 1247 L51 1177 L317 1177 Q280 1148 257.5 1102.5 Q235 1057 235 1013 L235 1013 Q235 949 266 897.5 Q297 846 350.5 815 Q404 784 469 784 L469 784 Q534 784 587 815 Q640 846 671.5 897.5 Q703 949 703 1013 L703 1013 Q703 1056 681.5 1101 Q660 1146 621 1177 L621 1177 L887 1177 L887 1247 L516 1247 L516 1170 Q550 1159 576.5 1135 Q603 1111 618 1079.5 Q633 1048 633 1013 L633 1013 Q633 966 611.5 929 Q590 892 553 870.5 Q516 849 469 849 L469 849 Q422 849 385 871 Q348 893 326.5 930 Q305 967 305 1013 L305 1013 Q305 1048 320.5 1080 Q336 1112 362.5 1135.5 Q389 1159 422 1170 L422 1170 L422 1247 Z M886 1480 L51 1480 L51 1410 L886 1410 L886 1480 Z", viewBox: "51 784 836 696" },
  "♏": { d: "M903 1567 L767 1671 L786 1598 L741 1598 Q668 1598 625 1568 Q582 1538 563 1473.5 Q544 1409 544 1304 L544 1304 L544 948 Q544 912 536 875.5 Q528 839 514 817 L514 817 Q503 826 487.5 845.5 Q472 865 456 889.5 Q440 914 425.5 939 Q411 964 401.5 985 Q392 1006 390 1018 L390 1018 L390 1480 L320 1480 L320 963 Q320 926 313 889 Q306 852 290 817 L290 817 Q276 829 256 855.5 Q236 882 216.5 914 Q197 946 182.5 974.5 Q168 1003 166 1018 L166 1018 L166 1480 L96 1480 L96 955 Q96 931 91 902.5 Q86 874 76 839.5 Q66 805 51 766 L51 766 L104 766 Q118 788 132.5 822.5 Q147 857 160 905 L160 905 Q169 888 187.5 862 Q206 836 227 809.5 Q248 783 266 766 L266 766 L325 766 Q343 792 359.5 832.5 Q376 873 382 905 L382 905 Q391 887 410 861.5 Q429 836 451.5 810 Q474 784 492 766 L492 766 L551 766 Q585 812 599.5 857 Q614 902 614 952 L614 952 L614 1304 Q614 1393 626.5 1443.5 Q639 1494 667 1515 Q695 1536 741 1536 L741 1536 L786 1536 L767 1463 L903 1567 Z", viewBox: "51 766 852 905" },
  "♐": { d: "M314 1254 L96 1473 L51 1427 L269 1208 L137 1078 L182 1033 L313 1164 L624 851 L299 851 L299 787 L719 787 L739 806 L739 1225 L674 1225 L674 893 L359 1209 L492 1342 L447 1387 L314 1254 Z", viewBox: "51 787 688 686" },
  "♑": { d: "M325 1672 L325 1672 L325 1617 Q370 1617 408 1599 Q446 1581 479.5 1542.5 Q513 1504 543 1441 L543 1441 Q517 1401 508 1350 Q499 1299 499 1239 L499 1239 L499 963 Q499 916 488 885 Q477 854 451 817 L451 817 Q437 830 418 862 Q399 894 377 937 Q355 980 334.5 1028.5 Q314 1077 296.5 1124 Q279 1171 269 1209.5 Q259 1248 259 1272 L259 1272 L259 1480 L189 1480 L189 1117 Q189 1054 186 1009 Q183 964 175 936 L175 936 Q160 880 129.5 855 Q99 830 51 830 L51 830 L51 766 Q121 766 166 797.5 Q211 829 233.5 896.5 Q256 964 256 1072 L256 1072 L256 1075 Q265 1039 285 991 Q305 943 330 896 Q355 849 377.5 813.5 Q400 778 413 766 L413 766 L501 766 Q519 787 534.5 818.5 Q550 850 559.5 883 Q569 916 569 945 L569 945 L569 1236 Q569 1285 573.5 1319.5 Q578 1354 588 1374 L588 1374 Q630 1315 671 1292.5 Q712 1270 761 1270 L761 1270 Q831 1270 873 1305.5 Q915 1341 915 1403 L915 1403 Q915 1472 868.5 1511 Q822 1550 741 1550 L741 1550 Q698 1550 663.5 1537.5 Q629 1525 589 1492 L589 1492 Q563 1549 522.5 1589 Q482 1629 432 1650.5 Q382 1672 325 1672 Z M741 1488 L741 1488 Q792 1488 821.5 1464.5 Q851 1441 851 1403 L851 1403 Q851 1373 826.5 1351.5 Q802 1330 762 1330 L762 1330 Q737 1330 712.5 1340 Q688 1350 665.5 1372.5 Q643 1395 620 1431 L620 1431 Q638 1454 673.5 1471 Q709 1488 741 1488 Z", viewBox: "51 766 864 906" },
  "♒": { d: "M269 967 L81 1083 L51 1027 L296 881 L356 994 L544 877 L608 994 L796 877 L890 1051 L836 1083 L773 967 L585 1083 L521 967 L333 1083 L269 967 Z M269 1267 L81 1383 L51 1327 L296 1181 L356 1294 L544 1177 L608 1294 L796 1177 L890 1351 L836 1383 L773 1267 L585 1383 L521 1267 L333 1383 L269 1267 Z", viewBox: "51 877 839 506" },
  "♓": { d: "M164 1480 L91 1480 Q155 1394 190 1308.5 Q225 1223 230 1139 L230 1139 L51 1139 L51 1075 L230 1075 Q224 988 189 901.5 Q154 815 90 728 L90 728 L164 728 Q229 806 264 892.5 Q299 979 304 1075 L304 1075 L511 1075 Q517 977 551.5 891.5 Q586 806 651 728 L651 728 L725 728 Q661 814 625.5 901 Q590 988 585 1075 L585 1075 L764 1075 L764 1139 L585 1139 Q590 1222 625 1307.5 Q660 1393 724 1480 L724 1480 L651 1480 Q585 1403 550.5 1318 Q516 1233 511 1139 L511 1139 L304 1139 Q299 1234 264 1319.5 Q229 1405 164 1480 L164 1480 Z", viewBox: "51 728 713 752" },
};

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG = "#100A1A";
const GOLD = "#C8A96E";
const TEXT = "#F0EDE8";
const VIO = "#7B6FA0";
const SEP_C = "#2A1F3D";
const GS = "Noto Sans Symbols 2";

const Sep = () => <div style={{ width: "100%", height: 1, background: SEP_C, flexShrink: 0 }} />;
const Logo = () => (
  <div style={{ fontSize: 18, letterSpacing: "6px", color: GOLD, fontFamily: "Inter" }}>
    astrolife.cl
  </div>
);

const base: React.CSSProperties = {
  width: 1080, height: 1080, background: BG,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "space-between",
  padding: "80px 100px 60px", boxSizing: "border-box",
};

// ─── Slide components ─────────────────────────────────────────────────────────
function Slide1({ d }: { d: CarruselData["slide1"] }) {
  return (
    <div style={base}>
      <div style={{ fontSize: 80, color: GOLD, fontFamily: GS, lineHeight: 1, flexShrink: 0 }}>✦</div>
      <Sep />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "24px 20px" }}>
        <div style={{ fontSize: 52, fontFamily: "Playfair Display", color: TEXT, textAlign: "center", fontWeight: 700, lineHeight: 1.3 }}>
          {d.titulo}
        </div>
        <div style={{ fontSize: 24, fontFamily: "Inter", color: VIO, textAlign: "center", lineHeight: 1.5 }}>
          {d.subtitulo}
        </div>
      </div>
      <Sep />
      <Logo />
    </div>
  );
}

const TOP_BG = "#18102A";

function Slide2({ d }: { d: CarruselData["slide2"] }) {
  const texto = truncateText(d.texto, 120);
  return (
    <div style={{ width: 1080, height: 1080, display: "flex", flexDirection: "column" }}>
      {/* Franja superior — 30% = 324px */}
      <div style={{
        width: "100%", height: 324, flexShrink: 0,
        background: "linear-gradient(180deg, #18102A 0%, #100A1A 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20,
      }}>
        {/* SVG path extracted from Noto Sans Symbols TTF — bypasses satori's emoji interceptor */}
        {ZODIAC[d.simbolo] ? (
          <svg width={180} height={180} viewBox={ZODIAC[d.simbolo].viewBox} fill={GOLD}>
            <path d={ZODIAC[d.simbolo].d} />
          </svg>
        ) : null}
        <div style={{ fontSize: 28, fontFamily: "Inter", fontWeight: 700, color: GOLD, letterSpacing: "6px" }}>
          {d.signo.toUpperCase()}
        </div>
      </div>

      {/* Franja central — 50% = 540px */}
      <div style={{
        width: "100%", height: 540, flexShrink: 0, background: BG,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 80px", boxSizing: "border-box",
      }}>
        <div style={{
          fontSize: 52, fontFamily: "Playfair Display", fontWeight: 400,
          color: TEXT, textAlign: "center", lineHeight: 1.4,
        }}>
          {texto}
        </div>
      </div>

      {/* Franja inferior — 20% = 216px */}
      <div style={{
        width: "100%", height: 216, flexShrink: 0, background: TOP_BG,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ width: "100%", height: 1, background: SEP_C, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 24, fontFamily: "Inter", fontWeight: 400, color: GOLD, letterSpacing: "3px" }}>
            astrolife.cl
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide3({ d }: { d: CarruselData["slide3"] }) {
  const Col = ({ sym, signo, texto }: { sym: string; signo: string; texto: string }) => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "0 48px" }}>
      <div style={{ fontSize: 72, color: GOLD, fontFamily: GS, lineHeight: 1 }}>{sym}</div>
      <div style={{ fontSize: 14, letterSpacing: "3px", color: GOLD, fontFamily: "Inter", fontWeight: 600 }}>
        {signo.toUpperCase()}
      </div>
      <div style={{ width: "100%", height: 1, background: SEP_C }} />
      <div style={{ fontSize: 18, fontFamily: "Inter", color: TEXT, textAlign: "center", lineHeight: 1.65 }}>
        {texto}
      </div>
    </div>
  );

  return (
    <div style={{ width: 1080, height: 1080, background: BG, display: "flex", flexDirection: "column", boxSizing: "border-box", padding: "60px 0 48px" }}>
      <div style={{ display: "flex", flex: 1, width: "100%" }}>
        <Col sym={d.simbolo1} signo={d.signo1} texto={d.texto1} />
        <div style={{ width: 1, background: SEP_C, flexShrink: 0 }} />
        <Col sym={d.simbolo2} signo={d.signo2} texto={d.texto2} />
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, paddingTop: 24 }}>
        <div style={{ width: "100%", height: 1, background: SEP_C }} />
        <Logo />
      </div>
    </div>
  );
}

function Slide4({ d }: { d: CarruselData["slide4"] }) {
  return (
    <div style={base}>
      <div style={{ fontSize: 80, color: GOLD, fontFamily: GS, lineHeight: 1, flexShrink: 0 }}>✦</div>
      <Sep />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "24px 40px" }}>
        <div style={{ fontSize: 40, fontFamily: "Playfair Display", color: TEXT, textAlign: "center", fontWeight: 700, lineHeight: 1.4 }}>
          {d.cta}
        </div>
        <div style={{ fontSize: 24, fontFamily: "Inter", color: VIO, textAlign: "center", fontStyle: "italic" }}>
          Astrid te espera
        </div>
      </div>
      <Sep />
      <Logo />
    </div>
  );
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { slide: 1 | 2 | 3 | 4; data: unknown };
    const fonts = await getFonts();

    let element: React.ReactElement;
    switch (body.slide) {
      case 1: element = <Slide1 d={body.data as CarruselData["slide1"]} />; break;
      case 2: element = <Slide2 d={body.data as CarruselData["slide2"]} />; break;
      case 3: element = <Slide3 d={body.data as CarruselData["slide3"]} />; break;
      case 4: element = <Slide4 d={body.data as CarruselData["slide4"]} />; break;
      default: return NextResponse.json({ error: "Invalid slide" }, { status: 400 });
    }

    return new ImageResponse(element, { width: 1080, height: 1080, fonts });
  } catch (err) {
    console.error("[carrusel-imagen] Error:", err);
    return NextResponse.json({ error: "Error generando imagen" }, { status: 500 });
  }
}

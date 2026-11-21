// Hand-drawn SVG scene: two developers at their desks, building a site on a shared screen.
// Every moving part is plain CSS (see "scene" rules in styles.css).
import { useNarrow } from '../lib/useSnap.js'

export default function Scene({ a = 'Lasya', b = 'Partner' }) {
  const narrow = useNarrow(760)
  const chip = (x, y, t, d, c) => (
    <g transform={`translate(${x} ${y})`}>
      <g className="sc-float" style={{ animationDelay: d }}>
        <rect width="52" height="26" rx="13" fill="#fff" fillOpacity=".1" stroke={c} strokeOpacity=".7" />
        <text x="26" y="17.5" textAnchor="middle" fontSize="12" fill="#F3F0FB" fontFamily="ui-monospace, Menlo, monospace">{t}</text>
      </g>
    </g>
  )
  const cursor = (cls, x, y, color, name) => (
    <g transform={`translate(${x} ${y})`}>
      <g className={cls}>
        <path d="M0 0 L0 20 L6 15 L10 24 L14 22 L10 14 L18 14 Z" fill={color} stroke="#0B0A2B" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="14" y="20" width={name.length * 8 + 14} height="20" rx="10" fill={color} />
        <text x="21" y="34" fontSize="12" fontWeight="700" fill="#0B0A2B" fontFamily="Figtree, sans-serif">{name}</text>
      </g>
    </g>
  )

  return (
    <svg className={`scene ${narrow ? 'scene--narrow' : ''}`} viewBox={narrow ? '185 25 830 545' : '0 0 1200 570'} role="img" aria-label={`${a} and ${b} working at their desks, building a website together on a shared screen`} preserveAspectRatio="xMidYMax meet">
      {/* floor */}
      <rect x="0" y="560" width="1200" height="10" fill="#0B0A2B" />

      {/* sticky notes */}
      <g transform="rotate(-5 135 185)">
        <rect x="100" y="150" width="72" height="72" rx="3" fill="#FFD166" />
        <rect x="112" y="168" width="46" height="5" rx="2.5" fill="#14123A" fillOpacity=".5" />
        <rect x="112" y="182" width="36" height="5" rx="2.5" fill="#14123A" fillOpacity=".5" />
        <rect x="112" y="196" width="42" height="5" rx="2.5" fill="#14123A" fillOpacity=".5" />
      </g>
      <g transform="rotate(4 1060 175)">
        <rect x="1030" y="140" width="72" height="72" rx="3" fill="#FF8FB1" />
        <rect x="1042" y="158" width="44" height="5" rx="2.5" fill="#14123A" fillOpacity=".5" />
        <rect x="1042" y="172" width="32" height="5" rx="2.5" fill="#14123A" fillOpacity=".5" />
        <rect x="1042" y="186" width="40" height="5" rx="2.5" fill="#14123A" fillOpacity=".5" />
      </g>

      {/* shared screen */}
      <rect x="420" y="40" width="360" height="232" rx="16" fill="#0B0A2B" stroke="#4A46A8" strokeWidth="3" />
      <path d="M420 56 a16 16 0 0 1 16 -16 h328 a16 16 0 0 1 16 16 v12 h-360z" fill="#1C1A52" />
      <circle cx="440" cy="54" r="4" fill="#FF6B95" />
      <circle cx="455" cy="54" r="4" fill="#FFD166" />
      <circle cx="470" cy="54" r="4" fill="#45E0DC" />
      <rect x="494" y="46" width="190" height="16" rx="8" fill="#2C2979" />
      <rect className="sc-b" style={{ animationDelay: '0s' }} x="440" y="82" width="320" height="14" rx="7" fill="#23206A" />
      <rect className="sc-b" style={{ animationDelay: '.5s' }} x="440" y="112" width="200" height="14" rx="5" fill="#F3F0FB" />
      <rect className="sc-b" style={{ animationDelay: '.8s' }} x="440" y="134" width="150" height="14" rx="5" fill="#F3F0FB" />
      <rect className="sc-b" style={{ animationDelay: '1.2s' }} x="440" y="160" width="72" height="22" rx="11" fill="#FF6B95" />
      <rect className="sc-b" style={{ animationDelay: '1.5s' }} x="664" y="108" width="96" height="74" rx="10" fill="#2C2979" />
      <circle className="sc-b" style={{ animationDelay: '1.8s' }} cx="712" cy="145" r="16" fill="#FFD166" />
      <rect className="sc-b" style={{ animationDelay: '2.1s' }} x="440" y="198" width="96" height="58" rx="8" fill="#FF6B95" />
      <rect className="sc-b" style={{ animationDelay: '2.4s' }} x="552" y="198" width="96" height="58" rx="8" fill="#6C63FF" />
      <rect className="sc-b" style={{ animationDelay: '2.7s' }} x="664" y="198" width="96" height="58" rx="8" fill="#45E0DC" />
      {cursor('sc-curA', 520, 120, '#FF6B95', a)}
      {cursor('sc-curB', 640, 170, '#45E0DC', b)}

      {/* desks */}
      <rect x="60" y="404" width="400" height="16" rx="6" fill="#2C2979" />
      <rect x="92" y="420" width="12" height="140" fill="#23206A" />
      <rect x="416" y="420" width="12" height="140" fill="#23206A" />
      <rect x="740" y="404" width="400" height="16" rx="6" fill="#2C2979" />
      <rect x="772" y="420" width="12" height="140" fill="#23206A" />
      <rect x="1096" y="420" width="12" height="140" fill="#23206A" />

      {/* person A */}
      <path d="M222 252 C222 206 298 206 298 252 L306 334 L214 334 Z" fill="#1B1340" />
      <rect x="212" y="298" width="96" height="112" rx="34" fill="#FF6B95" />
      <rect x="250" y="282" width="20" height="22" fill="#E9A47C" />
      <circle cx="260" cy="256" r="33" fill="#F2B48C" />
      <path d="M227 254 C228 222 292 220 293 254 C280 240 256 236 227 254Z" fill="#1B1340" />
      <g className="sc-eyes">
        <circle cx="249" cy="259" r="2.4" fill="#1B1340" />
        <circle cx="271" cy="259" r="2.4" fill="#1B1340" />
      </g>
      <path d="M252 271 Q260 277 268 271" stroke="#1B1340" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="198" y="332" width="124" height="68" rx="7" fill="#D5D8F0" />
      <circle cx="260" cy="366" r="7" fill="#FF6B95" />
      <rect x="188" y="398" width="144" height="6" rx="3" fill="#AEB2D6" />
      <circle className="sc-hand" cx="236" cy="397" r="7" fill="#F2B48C" />
      <circle className="sc-hand sc-hand2" cx="284" cy="397" r="7" fill="#F2B48C" />

      {/* person B */}
      <rect x="892" y="298" width="96" height="112" rx="34" fill="#36D1CC" />
      <rect x="930" y="282" width="20" height="22" fill="#B9774F" />
      <circle cx="940" cy="256" r="33" fill="#C98A62" />
      <path d="M906 252 C906 214 974 214 974 252 C962 236 918 236 906 252Z" fill="#2A1A12" />
      <path d="M905 258 C905 212 975 212 975 258" stroke="#FFD166" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="898" y="250" width="12" height="24" rx="6" fill="#FFD166" />
      <rect x="970" y="250" width="12" height="24" rx="6" fill="#FFD166" />
      <circle cx="927" cy="259" r="9" fill="none" stroke="#14123A" strokeWidth="2.4" />
      <circle cx="953" cy="259" r="9" fill="none" stroke="#14123A" strokeWidth="2.4" />
      <path d="M936 259 h8" stroke="#14123A" strokeWidth="2.4" />
      <g className="sc-eyes sc-eyes2">
        <circle cx="927" cy="259" r="2.2" fill="#14123A" />
        <circle cx="953" cy="259" r="2.2" fill="#14123A" />
      </g>
      <path d="M932 272 Q940 278 948 272" stroke="#14123A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="878" y="332" width="124" height="68" rx="7" fill="#D5D8F0" />
      <circle cx="940" cy="366" r="7" fill="#36D1CC" />
      <rect x="868" y="398" width="144" height="6" rx="3" fill="#AEB2D6" />
      <circle className="sc-hand sc-hand2" cx="916" cy="397" r="7" fill="#C98A62" />
      <circle className="sc-hand" cx="964" cy="397" r="7" fill="#C98A62" />

      {/* props */}
      <g>
        <rect x="408" y="384" width="26" height="20" rx="4" fill="#F3F0FB" />
        <path d="M434 389 q9 0 9 7 t-9 7" fill="none" stroke="#F3F0FB" strokeWidth="3" />
        <path className="sc-steam" d="M416 378 q-5 -8 0 -15 q5 -8 0 -15" />
        <path className="sc-steam sc-steam2" d="M426 378 q-5 -8 0 -15 q5 -8 0 -15" />
      </g>
      <g>
        <rect x="770" y="384" width="26" height="20" rx="4" fill="#FFD166" />
        <path d="M796 389 q9 0 9 7 t-9 7" fill="none" stroke="#FFD166" strokeWidth="3" />
        <path className="sc-steam" d="M778 378 q-5 -8 0 -15 q5 -8 0 -15" />
      </g>
      <g className="sc-sway">
        <ellipse cx="84" cy="362" rx="8" ry="22" transform="rotate(-24 84 362)" fill="#3FBF8F" />
        <ellipse cx="96" cy="352" rx="8" ry="24" fill="#2FA67A" />
        <ellipse cx="108" cy="362" rx="8" ry="22" transform="rotate(24 108 362)" fill="#3FBF8F" />
      </g>
      <rect x="82" y="382" width="28" height="22" rx="4" fill="#FF8F6B" />
      <path className="sc-lamp" d="M1030 346 L1060 358 L1010 404 L980 378Z" fill="#FFD166" />
      <path d="M1108 404 L1108 372 L1086 346 L1066 340" stroke="#FFD166" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M1040 332 L1074 344 L1068 358 L1034 346Z" fill="#FFD166" />
      <rect x="1090" y="398" width="36" height="6" rx="3" fill="#FFD166" />

      {/* floating code chips */}
      {chip(215, 300, '</>', '0s', '#FF6B95')}
      {chip(285, 300, '{ }', '2.2s', '#FF6B95')}
      {chip(895, 300, 'npm', '1.1s', '#45E0DC')}
      {chip(965, 300, 'UI', '3.3s', '#45E0DC')}
    </svg>
  )
}

/**
 * Original Unschool Kids character artwork.
 * STATUS: temporary staging assets — require illustrator review + IP signoff before public launch (see 09_MASTER_BUILD_PROMPT.md §H).
 * Do not treat these as approved final art.
 */

export function Momo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Momo, the lavender elephant">
      {/* ears */}
      <ellipse cx="62" cy="92" rx="30" ry="42" fill="#C9B8F0" />
      <ellipse cx="138" cy="92" rx="30" ry="42" fill="#C9B8F0" />
      <ellipse cx="62" cy="94" rx="18" ry="30" fill="#E4D9FA" />
      <ellipse cx="138" cy="94" rx="18" ry="30" fill="#E4D9FA" />
      {/* head */}
      <ellipse cx="100" cy="100" rx="52" ry="50" fill="#B9A5E5" />
      {/* trunk */}
      <path d="M100 118 C 96 140, 104 152, 100 168 C 98 174, 90 176, 88 170" fill="none" stroke="#B9A5E5" strokeWidth="20" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="80" cy="92" r="7" fill="#15223B" />
      <circle cx="120" cy="92" r="7" fill="#15223B" />
      <circle cx="82.5" cy="89.5" r="2.4" fill="#fff" />
      <circle cx="122.5" cy="89.5" r="2.4" fill="#fff" />
      {/* cheeks */}
      <circle cx="70" cy="110" r="7" fill="#F2A66C" opacity="0.55" />
      <circle cx="130" cy="110" r="7" fill="#F2A66C" opacity="0.55" />
      {/* dungarees straps */}
      <rect x="72" y="140" width="12" height="34" rx="6" fill="#147D75" />
      <rect x="116" y="140" width="12" height="34" rx="6" fill="#147D75" />
      {/* body */}
      <ellipse cx="100" cy="168" rx="46" ry="30" fill="#B9A5E5" />
      <rect x="80" y="152" width="40" height="26" rx="8" fill="#147D75" />
      <circle cx="100" cy="165" r="5" fill="#F5C044" />
      {/* satchel */}
      <rect x="128" y="150" width="26" height="22" rx="6" fill="#F5C044" />
      <rect x="128" y="150" width="26" height="8" rx="4" fill="#E0A92E" />
    </svg>
  );
}

export function Tara({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Tara, the orange squirrel">
      {/* tail */}
      <path d="M150 170 C 178 160, 186 120, 160 96 C 146 84, 132 88, 134 102 C 136 114, 150 118, 158 132 C 166 146, 160 162, 150 170 Z" fill="#E8894A" />
      <path d="M158 158 C 172 148, 176 126, 160 112" fill="none" stroke="#F2A66C" strokeWidth="8" strokeLinecap="round" />
      {/* body */}
      <ellipse cx="100" cy="150" rx="40" ry="38" fill="#F2A66C" />
      <ellipse cx="100" cy="158" rx="22" ry="24" fill="#FFF3E2" />
      {/* head */}
      <circle cx="100" cy="88" r="44" fill="#F2A66C" />
      {/* ears */}
      <path d="M66 60 L58 30 L84 48 Z" fill="#F2A66C" />
      <path d="M134 60 L142 30 L116 48 Z" fill="#F2A66C" />
      <path d="M66 54 L62 38 L76 48 Z" fill="#E8894A" />
      <path d="M134 54 L138 38 L124 48 Z" fill="#E8894A" />
      {/* eyes */}
      <circle cx="84" cy="84" r="7" fill="#15223B" />
      <circle cx="116" cy="84" r="7" fill="#15223B" />
      <circle cx="86.5" cy="81.5" r="2.4" fill="#fff" />
      <circle cx="118.5" cy="81.5" r="2.4" fill="#fff" />
      {/* cheeks + nose */}
      <circle cx="72" cy="102" r="7" fill="#E8894A" opacity="0.6" />
      <circle cx="128" cy="102" r="7" fill="#E8894A" opacity="0.6" />
      <ellipse cx="100" cy="102" rx="6" ry="4.5" fill="#15223B" />
      <path d="M100 106 Q 100 112, 92 112 M100 106 Q 100 112, 108 112" stroke="#15223B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* scarf */}
      <path d="M62 122 Q 100 140, 138 122 L 134 136 Q 100 154, 66 136 Z" fill="#2AA5A0" />
      <path d="M128 132 L 142 162 L 128 166 L 118 138 Z" fill="#1E7F7A" />
      {/* sketchbook */}
      <rect x="60" y="150" width="34" height="26" rx="5" fill="#7A5FC0" transform="rotate(-8 77 163)" />
      <rect x="65" y="155" width="24" height="16" rx="3" fill="#FFF7E9" transform="rotate(-8 77 163)" />
      <path d="M70 163 L 84 163" stroke="#7A5FC0" strokeWidth="2" transform="rotate(-8 77 163)" />
    </svg>
  );
}

export function Bobo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Bobo, the mint-green tortoise">
      {/* legs */}
      <ellipse cx="58" cy="160" rx="14" ry="18" fill="#8DC6A7" />
      <ellipse cx="142" cy="160" rx="14" ry="18" fill="#8DC6A7" />
      {/* shell */}
      <ellipse cx="100" cy="132" rx="62" ry="52" fill="#E8B93C" />
      <ellipse cx="100" cy="132" rx="62" ry="52" fill="none" stroke="#C99A2C" strokeWidth="4" />
      {/* shell patches */}
      <circle cx="78" cy="118" r="14" fill="#8DC6A7" />
      <rect x="104" y="108" width="26" height="26" rx="6" fill="#8DC6A7" transform="rotate(12 117 121)" />
      <path d="M88 148 L104 140 L96 158 Z" fill="#8DC6A7" />
      {/* head */}
      <circle cx="100" cy="66" r="30" fill="#8DC6A7" />
      {/* eyes */}
      <circle cx="89" cy="60" r="6" fill="#15223B" />
      <circle cx="111" cy="60" r="6" fill="#15223B" />
      <circle cx="91" cy="58" r="2" fill="#fff" />
      <circle cx="113" cy="58" r="2" fill="#fff" />
      {/* smile */}
      <path d="M90 76 Q 100 84, 110 76" stroke="#15223B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="78" cy="72" r="6" fill="#F2A66C" opacity="0.55" />
      <circle cx="122" cy="72" r="6" fill="#F2A66C" opacity="0.55" />
      {/* backpack */}
      <rect x="140" y="120" width="30" height="36" rx="10" fill="#315B87" />
      <rect x="140" y="120" width="30" height="12" rx="6" fill="#25466B" />
      {/* magnifier */}
      <circle cx="52" cy="112" r="14" fill="none" stroke="#315B87" strokeWidth="5" />
      <circle cx="52" cy="112" r="14" fill="#BFE3FF" opacity="0.4" />
      <line x1="62" y1="122" x2="74" y2="134" stroke="#315B87" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export const CHARACTERS = {
  momo: {
    name: "Momo",
    species: "lavender elephant",
    domain: "Numbers, patterns & mathematics",
    catchphrase: "Let's find out together!",
    Component: Momo,
  },
  tara: {
    name: "Tara",
    species: "orange squirrel",
    domain: "Language, reading & creativity",
    catchphrase: "What happens next?",
    Component: Tara,
  },
  bobo: {
    name: "Bobo",
    species: "mint-green tortoise",
    domain: "Science, discovery & reasoning",
    catchphrase: "What do you notice?",
    Component: Bobo,
  },
} as const;

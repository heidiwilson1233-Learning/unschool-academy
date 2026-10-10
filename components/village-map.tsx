/**
 * StorybookVillageMap — the one "wow" element for /kids/world.
 * A hand-drawn-register SVG map of the six village locations connected by a
 * dashed festival path that ends at the festival clearing. Each location node
 * is a real anchor link (<a href="#loc-…">) that jumps to its detail card below.
 *
 * Constraints: zero client JS (pure static SVG), light surfaces only (no dark
 * backgrounds per user preference), GPU-only motion (transform/opacity),
 * prefers-reduced-motion kills every animation. One shape family: rounded
 * edges only, matching components/characters.tsx.
 */
import { Momo, Tara, Bobo } from "./characters";

type Location = {
  slug: string;
  name: string;
  purpose: string;
  guide: "momo" | "tara" | "bobo";
};

const CharArt = { momo: Momo, tara: Tara, bobo: Bobo };

/* Map positions (800×520 viewBox) + playable state.
   Playable quests live as JSON under content/kids/quests/ and render at /kids/quest/[id]
   (Mango Garden) and K13 (Story Tree) are playable:true. Keep in sync there. */
const NODES: Array<{ slug: string; label: string; x: number; y: number; playable: boolean }> = [
  { slug: "mango-garden", label: "Mango Garden", x: 105, y: 128, playable: true },
  { slug: "story-tree", label: "Story Tree", x: 318, y: 92, playable: true },
  { slug: "shape-workshop", label: "Shape Workshop", x: 522, y: 118, playable: false },
  { slug: "discovery-pond", label: "Discovery Pond", x: 648, y: 272, playable: false },
  { slug: "little-market", label: "Little Market", x: 432, y: 356, playable: false },
  { slug: "kindness-corner", label: "Kindness Corner", x: 188, y: 308, playable: false },
];

const FESTIVAL = { x: 150, y: 448 };

/* Dashed festival path winding through every node, ending at the clearing. */
const FESTIVAL_PATH =
  "M105,128 C175,74 248,64 318,92 C388,120 452,142 522,118 C592,94 648,172 648,272 C648,348 542,356 432,356 C322,356 258,308 188,308 C152,308 138,376 150,448";

function Heart({ cx, cy, s, fill }: { cx: number; cy: number; s: number; fill: string }) {
  return (
    <path
      d={`M ${cx} ${cy + 0.38 * s}
         C ${cx - 0.62 * s} ${cy - 0.22 * s} ${cx - 0.36 * s} ${cy - 0.72 * s} ${cx} ${cy - 0.3 * s}
         C ${cx + 0.36 * s} ${cy - 0.72 * s} ${cx + 0.62 * s} ${cy - 0.22 * s} ${cx} ${cy + 0.38 * s} Z`}
      fill={fill}
    />
  );
}

export function StorybookVillageMap({ locations }: { locations: Location[] }) {
  const bySlug = new Map(locations.map((l) => [l.slug, l]));
  return (
    <svg
      viewBox="0 0 800 520"
      className="w-full h-auto min-w-[640px]"
      role="group"
      aria-label="Storybook map of the village. Choose a place to jump to its details below."
    >
      {/* ---------- landscape ---------- */}
      <ellipse cx="150" cy="492" rx="250" ry="110" fill="#8DC6A7" opacity="0.16" />
      <ellipse cx="690" cy="470" rx="230" ry="130" fill="#B9A5E5" opacity="0.14" />
      {/* sun + cloud */}
      <circle cx="716" cy="58" r="40" fill="none" stroke="#F2A66C" strokeWidth="3" opacity="0.45" />
      <circle cx="716" cy="58" r="28" fill="#FBD38D" opacity="0.85" />
      <g fill="#FFFFFF" opacity="0.9">
        <ellipse cx="430" cy="46" rx="52" ry="18" />
        <circle cx="408" cy="40" r="16" />
        <circle cx="432" cy="32" r="20" />
        <circle cx="456" cy="40" r="15" />
      </g>

      {/* ---------- location motifs (behind nodes) ---------- */}
      {/* Mango Garden: mango tree */}
      <rect x="100" y="98" width="10" height="34" rx="5" fill="#8A6B4A" />
      <circle cx="82" cy="74" r="22" fill="#7FB98A" opacity="0.9" />
      <circle cx="128" cy="74" r="22" fill="#7FB98A" opacity="0.9" />
      <circle cx="105" cy="58" r="26" fill="#8FC493" opacity="0.9" />
      <circle cx="96" cy="66" r="5" fill="#F2A66C" />
      <circle cx="116" cy="72" r="5" fill="#F2A66C" />
      {/* Story Tree: big story tree */}
      <rect x="311" y="108" width="14" height="40" rx="7" fill="#8A6B4A" />
      <circle cx="318" cy="76" r="36" fill="#6FAE7E" opacity="0.92" />
      <circle cx="292" cy="88" r="20" fill="#7FB98A" opacity="0.9" />
      <circle cx="344" cy="88" r="20" fill="#7FB98A" opacity="0.9" />
      {/* Shape Workshop: floating shapes */}
      <circle cx="478" cy="74" r="14" fill="#B9A5E5" />
      <rect x="548" y="60" width="28" height="28" rx="9" fill="#F2A66C" />
      <path d="M522,54 L537,82 L507,82 Z" fill="#7FB6C9" stroke="#7FB6C9" strokeWidth="8" strokeLinejoin="round" />
      {/* Discovery Pond: pond + lilies */}
      <ellipse cx="648" cy="300" rx="98" ry="46" fill="#BFE0F2" />
      <ellipse cx="648" cy="300" rx="70" ry="30" fill="none" stroke="#8FC3DE" strokeWidth="3" opacity="0.7" />
      <ellipse cx="606" cy="294" rx="19" ry="10" fill="#7FB98A" />
      <circle cx="606" cy="287" r="6" fill="#F4A9C4" />
      <ellipse cx="688" cy="306" rx="15" ry="8" fill="#7FB98A" />
      {/* Little Market: stall */}
      <rect x="392" y="312" width="8" height="52" rx="4" fill="#8A6B4A" />
      <rect x="464" y="312" width="8" height="52" rx="4" fill="#8A6B4A" />
      <rect x="384" y="296" width="96" height="20" rx="10" fill="#F2A66C" />
      <rect x="400" y="296" width="12" height="20" fill="#FFF7E9" opacity="0.85" />
      <rect x="424" y="296" width="12" height="20" fill="#FFF7E9" opacity="0.85" />
      <rect x="448" y="296" width="12" height="20" fill="#FFF7E9" opacity="0.85" />
      <rect x="390" y="326" width="84" height="34" rx="7" fill="#C98F4E" />
      {/* Kindness Corner: hearts */}
      <Heart cx={164} cy={272} s={30} fill="#F4A9C4" />
      <Heart cx={212} cy={282} s={22} fill="#F2A66C" />

      {/* ---------- festival clearing ---------- */}
      <circle cx={FESTIVAL.x} cy={FESTIVAL.y} r="42" fill="#F2A66C" opacity="0.18" />
      <circle cx={FESTIVAL.x} cy={FESTIVAL.y} r="42" fill="none" stroke="#C97A2E" strokeWidth="3" strokeDasharray="9 7" />
      <path d="M108,418 Q150,440 192,418" fill="none" stroke="#8A6B4A" strokeWidth="3" strokeLinecap="round" />
      <polygon points="126,426 134,426 130,438" fill="#F2A66C" />
      <polygon points="146,430 154,430 150,442" fill="#B9A5E5" />
      <polygon points="166,428 174,428 170,440" fill="#7FB98A" />
      <polygon
        points="150,436 153.5,443.2 161.2,443.6 155.4,448.8 157,456.4 150,452.4 143,456.4 144.6,448.8 138.8,443.6 146.5,443.2"
        fill="#C97A2E"
      />
      <text x={FESTIVAL.x} y={FESTIVAL.y + 62} textAnchor="middle" fontSize="10" letterSpacing="1.5" fill="#6B6252" fontWeight="700">
        FESTIVAL CLEARING
      </text>

      {/* ---------- festival path ---------- */}
      <path d={FESTIVAL_PATH} fill="none" stroke="#C97A2E" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 14" opacity="0.85" />

      {/* ---------- tappable location nodes ---------- */}
      {NODES.map((n) => {
        const loc = bySlug.get(n.slug);
        const Art = loc ? CharArt[loc.guide] : Momo;
        const name = loc ? loc.name : n.label;
        const purpose = loc ? loc.purpose : "";
        return (
          <a
            key={n.slug}
            href={`#loc-${n.slug}`}
            className="village-link"
            aria-label={`${name} — ${purpose}. Jump to details below.`}
          >
            <g className="village-node">
              {n.playable && (
                <circle cx={n.x} cy={n.y} r="30" fill="none" stroke="#3F7D5C" strokeWidth="3" className="village-halo" />
              )}
              <circle cx={n.x} cy={n.y} r="30" fill="#FFFDF8" stroke="#E7DCC3" strokeWidth="2" />
              <svg x={n.x - 22} y={n.y - 22} width="44" height="44" viewBox="0 0 200 200" aria-hidden="true">
                <Art decorative />
              </svg>
              {n.playable && (
                <g>
                  <rect x={n.x - 34} y={n.y - 58} width="68" height="18" rx="9" fill="#F2A66C" />
                  <text x={n.x} y={n.y - 45} textAnchor="middle" fontSize="9.5" fontWeight="800" letterSpacing="1.2" fill="#3D2A10">
                    PLAYABLE
                  </text>
                </g>
              )}
              <rect x={n.x - 60} y={n.y + 38} width="120" height="22" rx="11" fill="#FFFDF8" stroke="#E7DCC3" strokeWidth="1.5" />
              <text x={n.x} y={n.y + 53} textAnchor="middle" fontSize="10" letterSpacing="1" fill="#5B5346" fontWeight="700">
                {n.label.toUpperCase()}
              </text>
            </g>
          </a>
        );
      })}
    </svg>
  );
}

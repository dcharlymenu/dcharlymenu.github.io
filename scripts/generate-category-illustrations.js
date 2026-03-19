/**
 * Generates consistent cartoon-style food illustrations for each menu category.
 * Creates colorful flat-design SVGs and converts them to 400x400 webp.
 *
 * Usage: node scripts/generate-category-illustrations.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/images/categories');
const SIZE = 400;

// Each category gets a hand-crafted flat-design SVG illustration
const ILLUSTRATIONS = {
  desayunos: {
    bg: ['#FFF7ED', '#FEF3C7'],
    svg: `
      <!-- Plate -->
      <ellipse cx="200" cy="230" rx="140" ry="110" fill="#F5F0E8" stroke="#E8DFD0" stroke-width="3"/>
      <ellipse cx="200" cy="225" rx="120" ry="95" fill="#FAF5EE"/>
      <!-- Bacon strips -->
      <rect x="110" y="195" width="80" height="14" rx="7" fill="#DC4E41" transform="rotate(-8 150 200)"/>
      <rect x="108" y="215" width="75" height="14" rx="7" fill="#C9392C" transform="rotate(-5 145 220)"/>
      <rect x="112" y="175" width="70" height="12" rx="6" fill="#E06050" transform="rotate(-10 147 180)"/>
      <!-- Fried egg -->
      <ellipse cx="245" cy="200" rx="62" ry="55" fill="white" stroke="#F0E0C0" stroke-width="2"/>
      <ellipse cx="248" cy="196" rx="56" ry="48" fill="white"/>
      <circle cx="250" cy="193" r="24" fill="#FFB830"/>
      <circle cx="250" cy="193" r="18" fill="#FFC940"/>
      <ellipse cx="244" cy="188" rx="6" ry="4" fill="#FFE080" opacity="0.7"/>
    `,
  },

  entradas: {
    bg: ['#FFF7ED', '#FEF3C7'],
    svg: `
      <!-- Nachos / chips -->
      <polygon points="160,140 200,260 120,260" fill="#F0C050" stroke="#D4A030" stroke-width="2"/>
      <polygon points="200,120 250,260 150,260" fill="#E8B840" stroke="#C89830" stroke-width="2"/>
      <polygon points="240,150 280,260 200,260" fill="#F0C050" stroke="#D4A030" stroke-width="2"/>
      <!-- Cheese drizzle -->
      <path d="M155 200 Q170 185 185 210 Q200 230 210 205 Q225 180 240 210" fill="none" stroke="#FFB020" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
      <!-- Jalapeño slices -->
      <circle cx="175" cy="220" r="8" fill="#4CAF50" stroke="#388E3C" stroke-width="1.5"/>
      <circle cx="175" cy="220" r="3" fill="#66BB6A"/>
      <circle cx="225" cy="200" r="7" fill="#4CAF50" stroke="#388E3C" stroke-width="1.5"/>
      <circle cx="225" cy="200" r="2.5" fill="#66BB6A"/>
      <circle cx="200" cy="240" r="6" fill="#4CAF50" stroke="#388E3C" stroke-width="1.5"/>
      <!-- Sour cream dots -->
      <circle cx="190" cy="195" r="5" fill="white" opacity="0.9"/>
      <circle cx="215" cy="230" r="4" fill="white" opacity="0.9"/>
    `,
  },

  ensaladas: {
    bg: ['#F0FDF4', '#DCFCE7'],
    svg: `
      <!-- Bowl -->
      <path d="M70 210 Q70 320 200 320 Q330 320 330 210 Z" fill="#EFEBE0" stroke="#D6CFC0" stroke-width="3"/>
      <ellipse cx="200" cy="210" rx="130" ry="35" fill="#F5F0E8"/>
      <!-- Big lettuce leaves overflowing -->
      <ellipse cx="150" cy="185" rx="55" ry="35" fill="#43A047" transform="rotate(-15 150 185)"/>
      <ellipse cx="255" cy="180" rx="50" ry="32" fill="#66BB6A" transform="rotate(12 255 180)"/>
      <ellipse cx="200" cy="175" rx="60" ry="30" fill="#4CAF50" transform="rotate(-5 200 175)"/>
      <ellipse cx="170" cy="168" rx="45" ry="25" fill="#81C784" transform="rotate(8 170 168)"/>
      <ellipse cx="235" cy="170" rx="42" ry="24" fill="#A5D6A7" transform="rotate(-8 235 170)"/>
      <!-- Tomato wedges -->
      <circle cx="145" cy="170" r="15" fill="#EF5350" stroke="#D32F2F" stroke-width="1.5"/>
      <circle cx="145" cy="170" r="8" fill="#E53935" opacity="0.5"/>
      <circle cx="260" cy="168" r="13" fill="#F44336" stroke="#D32F2F" stroke-width="1.5"/>
      <circle cx="260" cy="168" r="7" fill="#E53935" opacity="0.5"/>
      <!-- Cucumber slices -->
      <circle cx="200" cy="162" r="11" fill="#A5D6A7" stroke="#81C784" stroke-width="1.5"/>
      <circle cx="200" cy="162" r="6" fill="#C8E6C9"/>
      <circle cx="225" cy="158" r="9" fill="#A5D6A7" stroke="#81C784" stroke-width="1.5"/>
      <circle cx="225" cy="158" r="5" fill="#C8E6C9"/>
      <!-- Carrot shreds -->
      <rect x="175" y="155" width="18" height="4" rx="2" fill="#FF9800" transform="rotate(-25 184 157)"/>
      <rect x="210" y="150" width="15" height="3.5" rx="2" fill="#FFA726" transform="rotate(15 218 152)"/>
      <rect x="160" y="160" width="14" height="3.5" rx="2" fill="#FFB74D" transform="rotate(20 167 162)"/>
    `,
  },

  tortas: {
    bg: ['#FFF7ED', '#FFEDD5'],
    svg: `
      <!-- Top bun (bolillo) -->
      <ellipse cx="200" cy="160" rx="100" ry="45" fill="#D4920A"/>
      <ellipse cx="200" cy="155" rx="95" ry="40" fill="#E8A830"/>
      <ellipse cx="185" cy="145" rx="30" ry="8" fill="#F0C060" opacity="0.6"/>
      <!-- Lettuce sticking out -->
      <path d="M110 185 Q130 175 150 190 Q170 175 190 190 Q210 175 230 190 Q250 175 270 185 Q290 178 295 188" fill="#66BB6A" stroke="#4CAF50" stroke-width="1.5"/>
      <!-- Tomato slice -->
      <ellipse cx="200" cy="200" rx="80" ry="10" fill="#EF5350"/>
      <!-- Meat (milanesa) -->
      <ellipse cx="200" cy="215" rx="85" ry="15" fill="#A0714E" stroke="#8B5E3C" stroke-width="1.5"/>
      <!-- Avocado -->
      <ellipse cx="200" cy="230" rx="75" ry="10" fill="#7CB342"/>
      <!-- Bottom bun -->
      <path d="M105 240 Q105 280 200 280 Q295 280 295 240 Z" fill="#D4920A"/>
      <ellipse cx="200" cy="240" rx="95" ry="12" fill="#E8A830"/>
    `,
  },

  hamburguesas: {
    bg: ['#FFF7ED', '#FFEDD5'],
    svg: `
      <!-- Top bun -->
      <path d="M100 180 Q100 120 200 120 Q300 120 300 180 Z" fill="#D4860A"/>
      <path d="M105 178 Q105 125 200 125 Q295 125 295 178 Z" fill="#E8A020"/>
      <!-- Sesame seeds -->
      <ellipse cx="170" cy="145" rx="5" ry="3" fill="#FAE0A0" transform="rotate(-20 170 145)"/>
      <ellipse cx="210" cy="138" rx="5" ry="3" fill="#FAE0A0" transform="rotate(15 210 138)"/>
      <ellipse cx="245" cy="150" rx="5" ry="3" fill="#FAE0A0" transform="rotate(-10 245 150)"/>
      <ellipse cx="190" cy="155" rx="4" ry="3" fill="#FAE0A0" transform="rotate(25 190 155)"/>
      <!-- Lettuce -->
      <path d="M95 190 Q115 178 135 192 Q155 178 175 192 Q195 178 215 192 Q235 178 255 192 Q275 178 305 190" fill="#4CAF50" stroke="#388E3C" stroke-width="1"/>
      <!-- Tomato -->
      <rect x="105" y="195" width="190" height="16" rx="4" fill="#EF5350"/>
      <!-- Cheese -->
      <path d="M95 215 L100 225 L305 225 L310 215 Q300 220 200 220 Q100 220 95 215" fill="#FFC107"/>
      <!-- Patty -->
      <ellipse cx="200" cy="240" rx="100" ry="20" fill="#5D3A1A" stroke="#4A2C10" stroke-width="2"/>
      <ellipse cx="200" cy="238" rx="95" ry="17" fill="#6D4A2A"/>
      <!-- Bottom bun -->
      <path d="M105 255 Q105 290 200 290 Q295 290 295 255 Z" fill="#D4860A"/>
      <ellipse cx="200" cy="256" rx="95" ry="10" fill="#E8A020"/>
    `,
  },

  'algo-mas': {
    bg: ['#FAF5FF', '#F3E8FF'],
    svg: `
      <!-- Quesadilla (folded tortilla) -->
      <path d="M100 250 L200 120 L300 250 Z" fill="#E8C870" stroke="#D4A840" stroke-width="3"/>
      <path d="M115 245 L200 135 L285 245 Z" fill="#F0D888"/>
      <!-- Melted cheese oozing out -->
      <path d="M115 248 Q140 258 165 248 Q180 260 200 248 Q220 262 240 248 Q260 258 285 248" fill="#FFB020" stroke="#F0A010" stroke-width="2"/>
      <!-- Grill marks -->
      <line x1="150" y1="170" x2="175" y2="220" stroke="#C89830" stroke-width="2.5" opacity="0.4"/>
      <line x1="190" y1="160" x2="205" y2="230" stroke="#C89830" stroke-width="2.5" opacity="0.4"/>
      <line x1="225" y1="170" x2="240" y2="230" stroke="#C89830" stroke-width="2.5" opacity="0.4"/>
      <!-- Decorative cilantro -->
      <circle cx="140" cy="265" r="4" fill="#66BB6A"/>
      <circle cx="155" cy="270" r="3" fill="#81C784"/>
      <circle cx="250" cy="268" r="3.5" fill="#66BB6A"/>
    `,
  },

  'comida-del-dia': {
    bg: ['#F0FDF4', '#ECFDF5'],
    svg: `
      <!-- Large plate -->
      <ellipse cx="200" cy="250" rx="150" ry="60" fill="#F5F0E8" stroke="#E0D5C5" stroke-width="3"/>
      <ellipse cx="200" cy="245" rx="130" ry="50" fill="#FAF5EE"/>
      <!-- Rice mound (left) -->
      <ellipse cx="135" cy="225" rx="50" ry="35" fill="#FFFDE7"/>
      <ellipse cx="135" cy="220" rx="45" ry="30" fill="#FFF9C4"/>
      <ellipse cx="125" cy="215" rx="4" ry="2" fill="white" opacity="0.6" transform="rotate(-20 125 215)"/>
      <ellipse cx="140" cy="210" rx="4" ry="2" fill="white" opacity="0.6" transform="rotate(15 140 210)"/>
      <ellipse cx="130" cy="225" rx="3" ry="1.5" fill="white" opacity="0.5" transform="rotate(-10 130 225)"/>
      <!-- Guisado / stew (right) -->
      <ellipse cx="260" cy="220" rx="55" ry="40" fill="#C62828"/>
      <ellipse cx="260" cy="215" rx="50" ry="35" fill="#D32F2F"/>
      <circle cx="245" cy="208" r="10" fill="#8D6E63" stroke="#6D4C41" stroke-width="1"/>
      <circle cx="270" cy="205" r="9" fill="#795548" stroke="#5D4037" stroke-width="1"/>
      <circle cx="255" cy="220" r="8" fill="#A1887F" stroke="#8D6E63" stroke-width="1"/>
      <circle cx="275" cy="218" r="7" fill="#8D6E63" stroke="#6D4C41" stroke-width="1"/>
      <!-- Beans (front center) -->
      <ellipse cx="195" cy="255" rx="35" ry="14" fill="#4E342E"/>
      <ellipse cx="195" cy="253" rx="32" ry="12" fill="#5D4037"/>
      <ellipse cx="190" cy="251" rx="8" ry="5" fill="#6D4C41" opacity="0.5"/>
      <!-- Tortilla stack (side) -->
      <ellipse cx="65" cy="240" rx="20" ry="40" fill="#E8C870" stroke="#D4A840" stroke-width="2" transform="rotate(5 65 240)"/>
      <ellipse cx="70" cy="240" rx="18" ry="38" fill="#F0D888" transform="rotate(5 70 240)"/>
      <ellipse cx="75" cy="240" rx="16" ry="36" fill="#E8C870" transform="rotate(5 75 240)"/>
      <!-- Lime wedge -->
      <path d="M310 245 L325 230 A18 18 0 0 1 330 252 Z" fill="#7CB342" stroke="#558B2F" stroke-width="1.5"/>
    `,
  },

  platillos: {
    bg: ['#FFF1F2', '#FFE4E6'],
    svg: `
      <!-- Plate -->
      <ellipse cx="200" cy="245" rx="140" ry="55" fill="#F5F0E8" stroke="#E0D5C5" stroke-width="3"/>
      <ellipse cx="200" cy="240" rx="120" ry="45" fill="#FAF5EE"/>
      <!-- Steak/meat -->
      <path d="M130 210 Q145 190 200 185 Q260 190 275 215 Q265 240 200 245 Q135 240 130 210 Z" fill="#8B4513" stroke="#6B3410" stroke-width="2"/>
      <path d="M140 212 Q150 195 200 192 Q255 197 265 217 Q258 235 200 238 Q143 235 140 212 Z" fill="#A0522D"/>
      <!-- Grill marks -->
      <line x1="160" y1="198" x2="165" y2="232" stroke="#6B3410" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
      <line x1="190" y1="194" x2="193" y2="236" stroke="#6B3410" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
      <line x1="220" y1="195" x2="222" y2="235" stroke="#6B3410" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
      <line x1="248" y1="200" x2="248" y2="230" stroke="#6B3410" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
      <!-- Garnish -->
      <circle cx="280" cy="225" r="6" fill="#66BB6A"/>
      <circle cx="290" cy="215" r="5" fill="#81C784"/>
      <circle cx="120" cy="230" r="5" fill="#FFC107"/>
    `,
  },

  mariscos: {
    bg: ['#ECFEFF', '#CFFAFE'],
    svg: `
      <!-- Plate -->
      <ellipse cx="200" cy="260" rx="140" ry="50" fill="#F5F0E8" stroke="#E0D5C5" stroke-width="3"/>
      <ellipse cx="200" cy="255" rx="120" ry="42" fill="#FAF5EE"/>
      <!-- Shrimp 1 (left) - C-shaped -->
      <path d="M130 160 Q115 160 115 175 Q115 195 135 210 Q155 225 170 230 Q180 232 182 225 Q184 218 175 212 Q155 200 145 188 Q138 178 145 170 Q152 163 130 160Z" fill="#FF7043" stroke="#E64A19" stroke-width="2"/>
      <path d="M140 175 Q155 180 165 195" fill="none" stroke="#E64A19" stroke-width="1" opacity="0.3"/>
      <path d="M135 185 Q150 190 160 205" fill="none" stroke="#E64A19" stroke-width="1" opacity="0.3"/>
      <ellipse cx="183" cy="228" rx="10" ry="5" fill="#FF8A65" stroke="#E64A19" stroke-width="1" transform="rotate(-20 183 228)"/>
      <ellipse cx="180" cy="233" rx="8" ry="4" fill="#FFAB91" stroke="#E64A19" stroke-width="1" transform="rotate(-30 180 233)"/>
      <circle cx="123" cy="162" r="3" fill="#1A1A1A"/>
      <path d="M128 158 Q115 140 100 135" fill="none" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M126 160 Q108 148 95 148" fill="none" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Shrimp 2 (right) - C-shaped -->
      <path d="M270 158 Q285 158 285 173 Q285 193 265 208 Q245 223 230 228 Q220 230 218 223 Q216 216 225 210 Q245 198 255 186 Q262 176 255 168 Q248 161 270 158Z" fill="#FF7043" stroke="#E64A19" stroke-width="2"/>
      <path d="M260 173 Q245 178 235 193" fill="none" stroke="#E64A19" stroke-width="1" opacity="0.3"/>
      <path d="M265 183 Q250 188 240 203" fill="none" stroke="#E64A19" stroke-width="1" opacity="0.3"/>
      <ellipse cx="217" cy="226" rx="10" ry="5" fill="#FF8A65" stroke="#E64A19" stroke-width="1" transform="rotate(20 217 226)"/>
      <ellipse cx="220" cy="231" rx="8" ry="4" fill="#FFAB91" stroke="#E64A19" stroke-width="1" transform="rotate(30 220 231)"/>
      <circle cx="277" cy="160" r="3" fill="#1A1A1A"/>
      <path d="M272 156 Q285 138 300 133" fill="none" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M274 158 Q292 146 305 146" fill="none" stroke="#FF8A65" stroke-width="1.5" stroke-linecap="round"/>
      <!-- Shrimp 3 (center, smaller) -->
      <path d="M195 195 Q185 195 185 205 Q185 218 198 228 Q210 237 218 240 Q224 241 225 236 Q226 231 220 227 Q208 220 202 212 Q198 206 203 200 Q207 196 195 195Z" fill="#EF6C00" stroke="#E65100" stroke-width="1.5"/>
      <ellipse cx="226" cy="238" rx="7" ry="4" fill="#FF8A65" stroke="#E65100" stroke-width="1" transform="rotate(-15 226 238)"/>
      <circle cx="190" cy="197" r="2" fill="#1A1A1A"/>
      <path d="M193 193 Q185 182 178 180" fill="none" stroke="#FF8A65" stroke-width="1" stroke-linecap="round"/>
      <!-- Lemon wedge -->
      <path d="M150 248 L168 230 A28 28 0 0 1 175 255 Z" fill="#FDD835" stroke="#F9A825" stroke-width="1.5"/>
      <!-- Cilantro -->
      <circle cx="230" cy="250" r="4" fill="#66BB6A"/>
      <circle cx="240" cy="245" r="3" fill="#81C784"/>
    `,
  },

  burritos: {
    bg: ['#FFF7ED', '#FFEDD5'],
    svg: `
      <!-- Burrito wrap -->
      <path d="M90 230 Q90 170 200 150 Q310 170 310 230 Q310 260 200 270 Q90 260 90 230 Z" fill="#E8C870" stroke="#D4A840" stroke-width="3"/>
      <path d="M100 228 Q100 175 200 158 Q300 175 300 228 Q300 255 200 263 Q100 255 100 228 Z" fill="#F0D888"/>
      <!-- Foil wrap on left side -->
      <path d="M90 200 Q90 170 130 160 L130 270 Q90 260 90 230 Z" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1.5"/>
      <path d="M90 200 Q95 190 100 200 Q105 210 110 200 Q115 190 120 200 Q125 210 130 200" fill="none" stroke="#D8D8D8" stroke-width="1.5"/>
      <!-- Filling visible at open end -->
      <ellipse cx="270" cy="215" rx="30" ry="40" fill="#D4A840"/>
      <circle cx="262" cy="205" r="8" fill="#8D6E63"/>
      <circle cx="275" cy="220" r="6" fill="#EF5350"/>
      <circle cx="268" cy="230" r="5" fill="#66BB6A"/>
      <circle cx="280" cy="208" r="5" fill="#FFC107"/>
      <circle cx="258" cy="220" r="7" fill="#6D4A2A"/>
    `,
  },

  menudo: {
    bg: ['#FEF2F2', '#FEE2E2'],
    svg: `
      <!-- Bowl -->
      <path d="M70 200 Q70 310 200 310 Q330 310 330 200 Z" fill="#D32F2F" stroke="#B71C1C" stroke-width="3"/>
      <ellipse cx="200" cy="200" rx="130" ry="35" fill="#E53935"/>
      <!-- Broth surface -->
      <ellipse cx="200" cy="195" rx="115" ry="28" fill="#EF5350" opacity="0.6"/>
      <!-- Hominy/maiz -->
      <circle cx="160" cy="190" r="7" fill="#FFF9C4" stroke="#FFF176" stroke-width="1"/>
      <circle cx="185" cy="185" r="6" fill="#FFF9C4" stroke="#FFF176" stroke-width="1"/>
      <circle cx="230" cy="188" r="7" fill="#FFF9C4" stroke="#FFF176" stroke-width="1"/>
      <circle cx="210" cy="195" r="5" fill="#FFF9C4" stroke="#FFF176" stroke-width="1"/>
      <circle cx="250" cy="193" r="5" fill="#FFF9C4" stroke="#FFF176" stroke-width="1"/>
      <!-- Oregano/cilantro on top -->
      <circle cx="175" cy="178" r="3" fill="#66BB6A"/>
      <circle cx="220" cy="180" r="2.5" fill="#81C784"/>
      <circle cx="195" cy="182" r="2" fill="#4CAF50"/>
      <!-- Chili flakes -->
      <circle cx="240" cy="183" r="2" fill="#B71C1C"/>
      <circle cx="155" cy="185" r="1.5" fill="#C62828"/>
      <!-- Steam -->
      <path d="M170 160 Q165 145 175 135" fill="none" stroke="#FFB0B0" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
      <path d="M200 155 Q195 140 205 128" fill="none" stroke="#FFB0B0" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
      <path d="M230 158 Q225 143 235 133" fill="none" stroke="#FFB0B0" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
    `,
  },

  postres: {
    bg: ['#FDF2F8', '#FCE7F3'],
    svg: `
      <!-- Plate -->
      <ellipse cx="200" cy="280" rx="100" ry="25" fill="#F5F0E8" stroke="#E0D5C5" stroke-width="2"/>
      <!-- Flan body -->
      <path d="M140 280 L145 180 Q200 170 255 180 L260 280 Z" fill="#F0A030" stroke="#D48E20" stroke-width="2"/>
      <path d="M145 180 Q200 170 255 180 Q200 190 145 180 Z" fill="#E89020"/>
      <!-- Caramel dripping -->
      <path d="M145 180 Q140 190 142 200" fill="none" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/>
      <path d="M175 175 Q172 188 174 198" fill="none" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/>
      <path d="M255 180 Q258 195 256 205" fill="none" stroke="#8B4513" stroke-width="4" stroke-linecap="round"/>
      <path d="M225 176 Q227 190 225 200" fill="none" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/>
      <!-- Caramel pool on top -->
      <ellipse cx="200" cy="177" rx="50" ry="8" fill="#8B4513" opacity="0.7"/>
      <!-- Shine -->
      <ellipse cx="180" cy="210" rx="8" ry="20" fill="white" opacity="0.15" transform="rotate(-5 180 210)"/>
      <!-- Caramel puddle on plate -->
      <ellipse cx="200" cy="282" rx="60" ry="8" fill="#8B4513" opacity="0.4"/>
    `,
  },

  'bebidas-sin-alcohol': {
    bg: ['#ECFEFF', '#E0F7FA'],
    svg: `
      <!-- Glass -->
      <path d="M145 130 L155 290 Q200 300 245 290 L255 130 Z" fill="white" opacity="0.3" stroke="#B0BEC5" stroke-width="2"/>
      <!-- Horchata liquid -->
      <path d="M148 150 L157 285 Q200 293 243 285 L252 150 Z" fill="#F5E6D0"/>
      <ellipse cx="200" cy="150" rx="52" ry="12" fill="#EDD8BC"/>
      <!-- Cinnamon sprinkle -->
      <circle cx="188" cy="148" r="1.5" fill="#8D6E63"/>
      <circle cx="200" cy="145" r="1" fill="#795548"/>
      <circle cx="210" cy="149" r="1.5" fill="#8D6E63"/>
      <circle cx="195" cy="151" r="1" fill="#795548"/>
      <!-- Cinnamon stick -->
      <rect x="210" y="110" width="5" height="70" rx="2" fill="#8D6E63" transform="rotate(8 212 145)"/>
      <rect x="211" y="112" width="3" height="65" rx="1.5" fill="#A1887F" transform="rotate(8 212 145)"/>
      <!-- Ice cubes -->
      <rect x="170" y="170" width="20" height="18" rx="4" fill="white" opacity="0.5" transform="rotate(-10 180 179)"/>
      <rect x="200" y="200" width="22" height="20" rx="4" fill="white" opacity="0.4" transform="rotate(5 211 210)"/>
      <rect x="175" y="230" width="18" height="16" rx="4" fill="white" opacity="0.45" transform="rotate(-5 184 238)"/>
    `,
  },

  'bebidas-con-alcohol': {
    bg: ['#FFFBEB', '#FEF3C7'],
    svg: `
      <!-- Mug body -->
      <rect x="120" y="130" width="130" height="160" rx="12" fill="#F59E0B" stroke="#D97706" stroke-width="3"/>
      <rect x="125" y="135" width="120" height="150" rx="10" fill="#FBBF24"/>
      <!-- Handle -->
      <path d="M250 170 Q290 170 290 210 Q290 250 250 250" fill="none" stroke="#D97706" stroke-width="8" stroke-linecap="round"/>
      <path d="M250 178 Q282 178 282 210 Q282 242 250 242" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
      <!-- Beer liquid -->
      <rect x="130" y="155" width="110" height="125" rx="6" fill="#F59E0B"/>
      <rect x="130" y="155" width="110" height="125" rx="6" fill="#FBBF24" opacity="0.6"/>
      <!-- Foam -->
      <ellipse cx="185" cy="155" rx="60" ry="18" fill="white"/>
      <circle cx="155" cy="148" r="14" fill="white"/>
      <circle cx="185" cy="145" r="16" fill="white"/>
      <circle cx="215" cy="147" r="13" fill="white"/>
      <circle cx="170" cy="140" r="10" fill="#FFF8E1"/>
      <circle cx="200" cy="138" r="11" fill="#FFF8E1"/>
      <!-- Bubbles -->
      <circle cx="160" cy="240" r="3" fill="white" opacity="0.4"/>
      <circle cx="195" cy="220" r="4" fill="white" opacity="0.3"/>
      <circle cx="175" cy="200" r="2.5" fill="white" opacity="0.35"/>
      <circle cx="210" cy="250" r="3" fill="white" opacity="0.3"/>
      <!-- Lime wedge on rim -->
      <path d="M130 150 L110 130 A25 25 0 0 1 140 125 Z" fill="#7CB342" stroke="#558B2F" stroke-width="1.5"/>
      <path d="M120 140 L115 133" stroke="#C5E1A5" stroke-width="1"/>
      <path d="M128 142 L125 132" stroke="#C5E1A5" stroke-width="1"/>
    `,
  },
};

function buildSvg(id) {
  const ill = ILLUSTRATIONS[id];
  const [bgTop, bgBottom] = ill.bg;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bgTop}"/>
      <stop offset="100%" stop-color="${bgBottom}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)"/>
  <g>${ill.svg}</g>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Generating cartoon category illustrations...\n');

  let count = 0;
  for (const id of Object.keys(ILLUSTRATIONS)) {
    const outPath = path.join(OUT_DIR, `${id}.webp`);
    const svg = buildSvg(id);
    const svgBuffer = Buffer.from(svg);

    await sharp(svgBuffer)
      .resize(SIZE, SIZE)
      .webp({ quality: 90 })
      .toFile(outPath);

    console.log(`  ✓ ${id}.webp`);
    count++;
  }

  console.log(`\nDone: ${count} illustrations generated`);
}

main();

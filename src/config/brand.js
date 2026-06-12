function svgDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const heroPosterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1200" role="img" aria-label="Learn with Taxo leadership learning poster">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#04182c"/><stop offset=".55" stop-color="#082945"/><stop offset="1" stop-color="#061B30"/></linearGradient>
    <radialGradient id="glow" cx="50%" cy="76%" r="35%"><stop stop-color="#f5d166" stop-opacity=".95"/><stop offset=".28" stop-color="#d4af37" stop-opacity=".42"/><stop offset="1" stop-color="#d4af37" stop-opacity="0"/></radialGradient>
    <linearGradient id="gold" x1="0" x2="1"><stop stop-color="#a77b18"/><stop offset=".45" stop-color="#f8df86"/><stop offset="1" stop-color="#d4af37"/></linearGradient>
    <linearGradient id="blue" x1="0" x2="1"><stop stop-color="#061B30"/><stop offset=".5" stop-color="#03a9f4"/><stop offset="1" stop-color="#123F6D"/></linearGradient>
  </defs>
  <rect width="900" height="1200" fill="url(#bg)"/><rect width="900" height="1200" fill="url(#glow)"/>
  <path d="M45 410 C150 330 245 320 340 370" fill="none" stroke="#d4af37" stroke-width="2" opacity=".35"/>
  <path d="M860 410 C740 330 650 325 560 375" fill="none" stroke="#d4af37" stroke-width="2" opacity=".35"/>
  <text x="78" y="172" font-family="Arial Black,Arial,sans-serif" font-size="142" fill="#06213c" stroke="#4aa8e8" stroke-width="2">T</text>
  <path d="M106 228 C224 214 318 181 389 112" fill="none" stroke="url(#gold)" stroke-width="24" stroke-linecap="round"/>
  <path d="M388 112 L376 166 L344 134 Z" fill="url(#gold)"/><path d="M145 265 Q203 226 263 265 Q205 238 145 265" fill="url(#gold)"/>
  <text x="360" y="225" font-family="Inter,Arial,sans-serif" font-size="64" font-weight="900" fill="#ffffff">Learn with</text>
  <text x="704" y="225" font-family="Inter,Arial,sans-serif" font-size="66" font-weight="900" fill="url(#blue)">Taxo</text>
  <line x1="370" y1="285" x2="520" y2="285" stroke="url(#gold)" stroke-width="5"/><line x1="675" y1="285" x2="825" y2="285" stroke="url(#gold)" stroke-width="5"/>
  <text x="548" y="300" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="44" letter-spacing="10" fill="#f7d777">Learn to Lead</text>
  <text x="596" y="365" text-anchor="middle" font-family="Tahoma,Arial,sans-serif" font-size="39" fill="#ffffff">تعلّم اليوم... واسبق بكرة.</text>
  <text x="450" y="520" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#f4c65a">Knowledge is the first step,</text>
  <text x="450" y="565" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#f4c65a">leadership is the destination.</text>
  <text x="450" y="615" text-anchor="middle" font-family="Georgia,serif" font-size="42" font-style="italic" font-weight="700" fill="#fff1b6">Lead the future.</text>
  <path d="M450 930 C470 810 470 715 450 650 C430 715 430 810 450 930" fill="url(#gold)" opacity=".92"/><path d="M450 650 L408 725 H492 Z" fill="url(#gold)"/>
  <path d="M252 925 C340 875 560 875 648 925 C575 902 325 902 252 925 Z" fill="#fff4c8" opacity=".96"/><path d="M256 930 C340 957 560 957 644 930" fill="none" stroke="#f5d166" stroke-width="4"/>
  <rect x="82" y="812" width="196" height="170" rx="10" fill="#08233e" stroke="#d4af37" opacity=".72"/>
  <text x="108" y="840" font-family="Arial,sans-serif" font-size="22" font-weight="800" fill="#d4af37">KNOWLEDGE</text><text x="105" y="900" font-family="Arial,sans-serif" font-size="22" font-weight="800" fill="#d4af37">SKILLS</text><text x="108" y="960" font-family="Arial,sans-serif" font-size="22" font-weight="800" fill="#d4af37">LEADERSHIP</text>
  <rect x="675" y="805" width="120" height="170" rx="8" fill="#091f37" stroke="#d4af37" opacity=".78"/>
  <text x="735" y="855" text-anchor="middle" font-family="Georgia,serif" font-size="23" fill="#d4af37">EDUCATE</text><text x="735" y="910" text-anchor="middle" font-family="Georgia,serif" font-size="23" fill="#d4af37">EMPOWER</text><text x="735" y="965" text-anchor="middle" font-family="Georgia,serif" font-size="23" fill="#d4af37">ELEVATE</text>
  <text x="165" y="1082" font-family="Inter,Arial,sans-serif" font-size="25" font-weight="800" fill="#fff">Learn</text><text x="390" y="1082" font-family="Inter,Arial,sans-serif" font-size="25" font-weight="800" fill="#fff">Grow</text><text x="615" y="1082" font-family="Inter,Arial,sans-serif" font-size="25" font-weight="800" fill="#fff">Lead</text>
  <text x="165" y="1110" font-family="Inter,Arial,sans-serif" font-size="18" fill="#eaf6fc">with Purpose</text><text x="390" y="1110" font-family="Inter,Arial,sans-serif" font-size="18" fill="#eaf6fc">with Discipline</text><text x="615" y="1110" font-family="Inter,Arial,sans-serif" font-size="18" fill="#eaf6fc">with Impact</text>
  <text x="450" y="1160" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#d4af37">Your Journey. Your Future. Our Mission.</text>
</svg>`;

export const brand = {
  name: 'Learn with Taxo',
  headerName: 'LEARN WITH TAXO',
  tagline: 'Learn to Lead',
  arabicTagline: 'اتعلم اليوم... واسبق بكره',
  domain: 'https://www.learnwithtaxo.com',
  logoPath: '/assets/logo.png',
  fullLogoPath: svgDataUri(heroPosterSvg),
  logoSymbolPath: '/assets/no2',
  ownerEmail: 'sagafinearts@gmail.com'
};

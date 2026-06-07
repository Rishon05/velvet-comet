/* =========================================================================
   Velvet Comet - product catalog
   This single file powers the homepage grid AND every product page.
   To edit the store, edit this list. Keep all claims TRUE of the real product
   (UK DMCC Act: subjective puffery is fine, false factual claims are not).

   Per-product checkout: create a Stripe Payment Link for each product and
   paste its URL into `stripe`. Leave "" until ready.
   ========================================================================= */

const CATEGORIES = ["All", "Audio", "Tech", "Security", "Wellness"];

const PRODUCTS = [
  {
    id: "translator-earbuds",
    name: "Lingo Live Translation Earbuds",
    category: "Audio",
    price: 79,
    emoji: "🎧",
    image: "images/translator-a_viz.png",
    tagline: "Speak every language.",
    hook: "Real-time, two-way translation across 144 languages, right in your ears. Slip them in, start talking, and understand the world.",
    badge: "Best seller",
    features: [
      { title: "144 languages", desc: "Real-time, two-way translation across 144 languages and dialects, covering most of the world." },
      { title: "Clear, private audio", desc: "Directional sound with no leakage, so your conversation stays crisp and stays yours." },
      { title: "Bluetooth 5.4", desc: "A low-power 5.4 chip for fast, stable pairing, with full-colour touch control." },
      { title: "Comfortable all day", desc: "Ergonomic over-ear hooks and skin-friendly silicone built for hours of wear." }
    ],
    specs: [
      ["Languages", "144 languages & dialects"],
      ["Connectivity", "Bluetooth 5.4 · USB-C charging"],
      ["Battery", "4-5 hrs listening · ~30 hrs standby"],
      ["Charge time", "1-2 hrs for a full charge"],
      ["Fit & material", "Over-ear hook · ABS + skin-friendly silicone"],
      ["In the box", "Earbuds · charging case · USB-C cable · guide"]
    ],
    stripe: ""
  },
  {
    id: "translator-earbuds-pro",
    name: "Lingo Pro Translation Earbuds",
    category: "Audio",
    price: 75,
    emoji: "🎧",
    image: "images/translator-b_viz.png",
    tagline: "Speak every language, anywhere.",
    hook: "Real-time, two-way translation across 144 languages in a compact, splash-resistant design, with its own AI app for recording and chat.",
    badge: "Splash-proof",
    features: [
      { title: "144 languages", desc: "Real-time, two-way translation across 144 languages, covering most countries and regions." },
      { title: "Splash-resistant (IPX4)", desc: "An IPX4 rating shrugs off sweat and splashes, ready for travel and everyday wear." },
      { title: "Powerful AI app", desc: "A companion app adds recording, transcription and AI chat alongside live translation." },
      { title: "Rich 13mm sound", desc: "13mm drivers deliver clear, full audio for calls, music and translation alike." }
    ],
    specs: [
      ["Languages", "144 languages & dialects"],
      ["Connectivity", "Bluetooth 5.3 · USB-C charging"],
      ["Water resistance", "IPX4 splash-resistant"],
      ["Battery", "~4 hrs per charge · 250mAh case"],
      ["Drivers", "13mm"],
      ["In the box", "Earbuds · charging case · USB-C cable · guide"]
    ],
    stripe: ""
  },
  {
    id: "bone-conduction",
    name: "Stride Bone Conduction Headphones",
    category: "Audio",
    price: 49,
    emoji: "🎧",
    image: "images/bone_viz.png",
    tagline: "Open ears. Open road.",
    hook: "Bone-conduction sound that rests on your cheekbones, not in your ears, so you hear your music and the world at once. Built for runs, rides and everything between.",
    badge: "Open-ear",
    features: [
      { title: "Open-ear bone conduction", desc: "Sound travels through your cheekbones, leaving your ears open to traffic, voices and the world around you." },
      { title: "Sweat & splash resistant", desc: "Shrugs off sweat and rain for runs, gym sessions and the daily commute." },
      { title: "All-week standby", desc: "Around 6 hours of play, a 2-hour charge, and up to 7 days on standby." },
      { title: "Secure, featherlight fit", desc: "A lightweight wraparound band stays put through every workout, with a built-in mic for calls." }
    ],
    specs: [
      ["Type", "Open-ear bone conduction"],
      ["Connectivity", "Bluetooth 5.0 · 10m range"],
      ["Battery", "~6 hrs play · ~7 days standby"],
      ["Charge time", "~2 hrs (USB)"],
      ["Water resistance", "Sweat & splash resistant"],
      ["Sound", "20-20,000Hz · built-in mic"]
    ],
    stripe: ""
  },
  {
    id: "levitating-speaker",
    name: "Halo Levitating Speaker",
    category: "Audio",
    price: 99,
    emoji: "🛸",
    image: "images/speaker_viz.png",
    tagline: "Sound that floats.",
    hook: "A speaker that hovers and spins in mid-air on a magnetic base, filling the room with 360° sound. A genuine conversation piece.",
    badge: "Statement piece",
    features: [
      { title: "Magnetic levitation", desc: "The orb floats and rotates above its base. Real magic on a desk." },
      { title: "360° sound", desc: "Spinning design pushes audio evenly around the room." },
      { title: "Bluetooth streaming", desc: "Pairs instantly with any phone, tablet or laptop." },
      { title: "Ambient lighting", desc: "Soft glow that turns any shelf into a centrepiece." }
    ],
    specs: [
      ["Effect", "Magnetic levitation + rotation"],
      ["Audio", "360° wireless speaker"],
      ["Connectivity", "Bluetooth"],
      ["In the box", "Floating orb · base · adapter"]
    ],
    stripe: ""
  },
  {
    id: "laser-keyboard",
    name: "Photon Laser Projection Keyboard",
    category: "Tech",
    price: 69,
    emoji: "⌨️",
    image: "images/laser_kb.png",
    tagline: "Type on thin air.",
    hook: "Projects a full-size glowing keyboard onto any flat surface. Pure sci-fi that actually works, and folds away into your pocket.",
    features: [
      { title: "Laser-projected keys", desc: "A full QWERTY layout beamed onto your desk." },
      { title: "Works on any surface", desc: "Table, counter, anywhere flat becomes your keyboard." },
      { title: "Bluetooth pairing", desc: "Connects to phones, tablets and computers." },
      { title: "Pocket-sized", desc: "Smaller than a lighter, ready when inspiration strikes." }
    ],
    specs: [
      ["Projection", "Laser virtual QWERTY"],
      ["Connectivity", "Bluetooth"],
      ["Power", "Rechargeable battery"],
      ["Surface", "Any flat, non-reflective surface"]
    ],
    stripe: ""
  },
  {
    id: "fingerprint-padlock",
    name: "Vault Fingerprint Smart Padlock",
    category: "Security",
    price: 39,
    emoji: "🔐",
    image: "images/lock.png",
    tagline: "Unlock with a touch.",
    hook: "Biometric security in your pocket. Opens in a fraction of a second with your fingerprint, so you never carry a key again.",
    features: [
      { title: "Instant biometric unlock", desc: "Opens in well under a second with a registered print." },
      { title: "Stores multiple prints", desc: "Add family or teammates so everyone has access." },
      { title: "USB-C rechargeable", desc: "Months of use per charge, no batteries to buy." },
      { title: "Tough weatherproof body", desc: "Built for gym lockers, gates, bags and sheds." }
    ],
    specs: [
      ["Unlock", "Fingerprint biometric"],
      ["Capacity", "Multiple stored prints"],
      ["Power", "USB-C rechargeable"],
      ["Build", "Weather-resistant alloy"]
    ],
    stripe: ""
  },
  {
    id: "recorder-pen",
    name: "Scribe AI Voice Recorder Pen",
    category: "Tech",
    price: 65,
    emoji: "🖊️",
    image: "images/pen_viz.png",
    tagline: "Capture every word.",
    hook: "A sleek recorder that turns meetings, lectures and ideas into clean text with AI transcription. Look sharp, miss nothing.",
    features: [
      { title: "AI transcription", desc: "Turns your recordings into searchable text." },
      { title: "One-touch recording", desc: "Capture the moment the instant it matters." },
      { title: "Clear audio", desc: "Sensitive mic built for voices across a room." },
      { title: "Executive design", desc: "A discreet, premium pen-style body." }
    ],
    specs: [
      ["Function", "Voice recording + AI transcription"],
      ["Storage", "Onboard memory"],
      ["Power", "Rechargeable"],
      ["Use", "Meetings · lectures · notes"]
    ],
    stripe: ""
  },
  {
    id: "sleep-mask",
    name: "Dusk Bluetooth Sleep Mask",
    category: "Wellness",
    price: 39,
    emoji: "😴",
    image: "images/sleep.png",
    tagline: "Drift off in 3D sound.",
    hook: "A buttery-soft mask with built-in flat speakers. Blackout comfort plus your favourite sleep sounds, with nothing jabbing your ears.",
    features: [
      { title: "Built-in audio", desc: "Ultra-thin speakers play music, white noise or meditations." },
      { title: "True blackout", desc: "Contoured design blocks light without pressing your eyes." },
      { title: "Buttery-soft fabric", desc: "Breathable and gentle for side and back sleepers." },
      { title: "Wireless freedom", desc: "Pairs with your phone, no tangled headphones in bed." }
    ],
    specs: [
      ["Audio", "Built-in flat Bluetooth speakers"],
      ["Comfort", "Contoured blackout design"],
      ["Power", "Rechargeable"],
      ["Use", "Sleep · travel · meditation"]
    ],
    stripe: ""
  },
  {
    id: "laser-measure",
    name: "Range Pocket Laser Measure",
    category: "Tech",
    price: 45,
    emoji: "📐",
    image: "images/measure_viz.png",
    tagline: "Laser-accurate, one click.",
    hook: "Measure a room in seconds with a tap. Pocket-sized laser precision for DIY, moving, decorating and trades.",
    features: [
      { title: "One-click measuring", desc: "Point, click, read the distance instantly." },
      { title: "Laser precision", desc: "Accurate readings far beyond a tape measure's reach." },
      { title: "Area & volume", desc: "Calculate room sizes without the maths." },
      { title: "Clear digital display", desc: "Easy-to-read backlit screen." }
    ],
    specs: [
      ["Function", "Laser distance measurement"],
      ["Modes", "Distance · area · volume"],
      ["Display", "Backlit digital"],
      ["Power", "Rechargeable / battery"]
    ],
    stripe: ""
  }
];

/* helpers */
function getProduct(id) { return PRODUCTS.find(p => p.id === id); }
function gbp(n) { return "£" + Number(n).toFixed(Number.isInteger(n) ? 0 : 2); }

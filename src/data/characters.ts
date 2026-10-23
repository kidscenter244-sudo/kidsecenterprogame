import { CharacterItem, StageEnvironment } from '../types';

export interface RobloxAvatarConfig {
  faceType: 'smile' | 'smirk' | 'serious' | 'mask' | 'ninja' | 'saiyan' | 'bat' | 'electric' | 'cyborg' | 'pharaoh';
  hairType: 'swept' | 'spiky' | 'fade' | 'curly' | 'long-blonde' | 'saiyan-huge' | 'ninja-headband' | 'cowl' | 'helmet' | 'crown' | 'cap';
  skinTone: string;
  hasBeard?: boolean;
}

export const CHARACTERS: (CharacterItem & { robloxConfig: RobloxAvatarConfig })[] = [
  // 1. Rookie Champ (Free starter)
  {
    id: 'rookie-champ',
    name: 'Bloxy Prodigy',
    title: 'Starter Math Ace',
    category: 'legend',
    tier: 'Starter',
    price: 0,
    primaryColor: '#2563eb', // Classic Roblox Blue
    secondaryColor: '#1e293b',
    accentColor: '#f59e0b',
    skinColor: '#ffd599',
    hairColor: '#334155',
    jerseyNumber: '01',
    description: 'The iconic classic Roblox champion! Ready to calculate at lightning speed.',
    unlockedByDefault: true,
    stats: { speed: 70, power: 65, focus: 80 },
    robloxConfig: {
      faceType: 'smile',
      hairType: 'cap',
      skinTone: '#ffd599'
    }
  },
  // 2. Football: Lionel Messi
  {
    id: 'messi-10',
    name: 'Lionel Messi',
    title: 'The Magician GOAT #10',
    category: 'football',
    tier: 'Mythic',
    price: 8500,
    primaryColor: '#f472b6', // Inter Miami Pink / Argentina Sky
    secondaryColor: '#1e1b4b',
    accentColor: '#fbbf24',
    skinColor: '#ffd599',
    hairColor: '#451a03',
    jerseyNumber: '10',
    hasSoccerBall: true,
    hasAura: true,
    auraColor: '#fbbf24',
    description: '8 Ballon d’Ors! Iconic Roblox beard, golden touch and surgical math IQ.',
    stats: { speed: 97, power: 93, focus: 99 },
    robloxConfig: {
      faceType: 'smile',
      hairType: 'swept',
      skinTone: '#ffd599',
      hasBeard: true
    }
  },
  // 3. Football: Cristiano Ronaldo
  {
    id: 'ronaldo-7',
    name: 'Cristiano Ronaldo',
    title: 'CR7 The Machine #7',
    category: 'football',
    tier: 'Mythic',
    price: 8500,
    primaryColor: '#eab308', // Al Nassr Yellow / Gold
    secondaryColor: '#1e3a8a',
    accentColor: '#ffffff',
    skinColor: '#e0a96d',
    hairColor: '#0f172a',
    jerseyNumber: '7',
    hasSoccerBall: true,
    hasAura: true,
    auraColor: '#eab308',
    description: 'Roblox SIUUU celebration! Relentless speed, jumping power, and accuracy.',
    stats: { speed: 99, power: 99, focus: 96 },
    robloxConfig: {
      faceType: 'smirk',
      hairType: 'fade',
      skinTone: '#e0a96d'
    }
  },
  // 4. Football: Kylian Mbappé
  {
    id: 'mbappe-9',
    name: 'Kylian Mbappé',
    title: 'Turbo Ninja #9',
    category: 'football',
    tier: 'Legendary',
    price: 6000,
    primaryColor: '#ffffff', // Real Madrid White
    secondaryColor: '#1e1b4b',
    accentColor: '#f59e0b',
    skinColor: '#8d5524',
    hairColor: '#000000',
    jerseyNumber: '9',
    hasSoccerBall: true,
    description: 'Supersonic pace on the pitch! Solves equations in fractional seconds.',
    stats: { speed: 99, power: 92, focus: 91 },
    robloxConfig: {
      faceType: 'smirk',
      hairType: 'fade',
      skinTone: '#8d5524'
    }
  },
  // 5. Football: Erling Haaland
  {
    id: 'haaland-9',
    name: 'Erling Haaland',
    title: 'The Viking Striker #9',
    category: 'football',
    tier: 'Legendary',
    price: 5500,
    primaryColor: '#38bdf8', // Man City Sky Blue
    secondaryColor: '#ffffff',
    accentColor: '#0284c7',
    skinColor: '#ffe0bd',
    hairColor: '#fde047',
    jerseyNumber: '9',
    hasSoccerBall: true,
    description: 'Colossal Viking striker with unstoppable power and robotic precision.',
    stats: { speed: 95, power: 99, focus: 93 },
    robloxConfig: {
      faceType: 'serious',
      hairType: 'long-blonde',
      skinTone: '#ffe0bd'
    }
  },
  // 6. Football: Mohamed Salah
  {
    id: 'salah-11',
    name: 'Mohamed Salah',
    title: 'The Egyptian King #11',
    category: 'football',
    tier: 'Legendary',
    price: 5000,
    primaryColor: '#dc2626', // Liverpool Red
    secondaryColor: '#ffffff',
    accentColor: '#16a34a',
    skinColor: '#c68642',
    hairColor: '#18181b',
    jerseyNumber: '11',
    hasSoccerBall: true,
    description: 'Speedy Egyptian wizard with brilliant tactics and rapid arithmetic reflexes.',
    stats: { speed: 96, power: 89, focus: 97 },
    robloxConfig: {
      faceType: 'smile',
      hairType: 'curly',
      skinTone: '#c68642',
      hasBeard: true
    }
  },
  // 7. Football: Neymar Jr
  {
    id: 'neymar-10',
    name: 'Neymar Jr',
    title: 'Samba Trickster #10',
    category: 'football',
    tier: 'Epic',
    price: 3800,
    primaryColor: '#10b981', // Brazil Emerald
    secondaryColor: '#fde047',
    accentColor: '#1e3a8a',
    skinColor: '#c68642',
    hairColor: '#facc15',
    jerseyNumber: '10',
    hasSoccerBall: true,
    description: 'Flamboyant Brazilian flair with highlighted Roblox spikes and lightning tricks.',
    stats: { speed: 94, power: 85, focus: 90 },
    robloxConfig: {
      faceType: 'smirk',
      hairType: 'spiky',
      skinTone: '#c68642'
    }
  },
  // 8. Football: Vinicius Jr
  {
    id: 'vinicius-7',
    name: 'Vinicius Jr',
    title: 'Vini Golden Spark #7',
    category: 'football',
    tier: 'Epic',
    price: 3600,
    primaryColor: '#2563eb', // Real Madrid Away Blue
    secondaryColor: '#fbbf24',
    accentColor: '#ffffff',
    skinColor: '#5c3826',
    hairColor: '#09090b',
    jerseyNumber: '7',
    hasSoccerBall: true,
    description: 'Dazzling speed dribbler with electrifying stepovers and high math momentum.',
    stats: { speed: 98, power: 87, focus: 89 },
    robloxConfig: {
      faceType: 'smile',
      hairType: 'fade',
      skinTone: '#5c3826'
    }
  },
  // 9. Football: Jude Bellingham
  {
    id: 'bellingham-5',
    name: 'Jude Bellingham',
    title: 'Belligol Midfield Boss #5',
    category: 'football',
    tier: 'Epic',
    price: 3200,
    primaryColor: '#18181b', // Black & Gold
    secondaryColor: '#eab308',
    accentColor: '#ffffff',
    skinColor: '#8d5524',
    hairColor: '#09090b',
    jerseyNumber: '5',
    hasSoccerBall: true,
    description: 'The iconic open-arms celebration! Controls the entire midfield tempo.',
    stats: { speed: 90, power: 94, focus: 95 },
    robloxConfig: {
      faceType: 'smile',
      hairType: 'fade',
      skinTone: '#8d5524'
    }
  },
  // 10. Football: Kevin De Bruyne
  {
    id: 'debruyne-17',
    name: 'Kevin De Bruyne',
    title: 'The Math Maestro #17',
    category: 'football',
    tier: 'Epic',
    price: 3000,
    primaryColor: '#0284c7', // Sky Blue
    secondaryColor: '#93c5fd',
    accentColor: '#ffffff',
    skinColor: '#ffe0bd',
    hairColor: '#ca8a04',
    jerseyNumber: '17',
    hasSoccerBall: true,
    description: 'Finds angles no human thought possible. Perfect mathematical vision.',
    stats: { speed: 85, power: 91, focus: 99 },
    robloxConfig: {
      faceType: 'serious',
      hairType: 'swept',
      skinTone: '#ffe0bd'
    }
  },
  // 11. Superhero: Spider-Hero
  {
    id: 'spider-hero',
    name: 'Spider Blox',
    title: 'The Web Slinger',
    category: 'superhero',
    tier: 'Legendary',
    price: 4500,
    primaryColor: '#dc2626', // Spider Red
    secondaryColor: '#2563eb', // Spider Blue
    accentColor: '#000000',
    skinColor: '#dc2626',
    hairColor: '#dc2626',
    jerseyNumber: '🕷️',
    hasAura: true,
    auraColor: '#60a5fa',
    description: 'Roblox Spider suit with web grid torso and glowing lenses.',
    stats: { speed: 98, power: 92, focus: 95 },
    robloxConfig: {
      faceType: 'mask',
      hairType: 'cowl',
      skinTone: '#dc2626'
    }
  },
  // 12. Superhero: Dark Knight (Batman)
  {
    id: 'dark-knight',
    name: 'Shadow Blox',
    title: 'Gotham Bat Protector',
    category: 'superhero',
    tier: 'Legendary',
    price: 4800,
    primaryColor: '#0f172a', // Obsidian Slate
    secondaryColor: '#334155',
    accentColor: '#eab308',
    skinColor: '#ffd599',
    hairColor: '#0f172a',
    hasCape: true,
    jerseyNumber: '🦇',
    description: 'Armored Roblox bat-suit with cape and utility belt. Master of logic.',
    stats: { speed: 89, power: 96, focus: 98 },
    robloxConfig: {
      faceType: 'bat',
      hairType: 'cowl',
      skinTone: '#ffd599'
    }
  },
  // 13. Anime: Super Saiyan Goku
  {
    id: 'saiyan-goku',
    name: 'Saiyan Blox',
    title: 'Super Saiyan God',
    category: 'anime',
    tier: 'Mythic',
    price: 9000,
    primaryColor: '#ea580c', // Orange Gi
    secondaryColor: '#1d4ed8', // Blue undershirt
    accentColor: '#fde047',
    skinColor: '#fcd34d',
    hairColor: '#facc15',
    hasAura: true,
    auraColor: '#fde047',
    jerseyNumber: '悟',
    description: 'Giant golden spiky Roblox hair! Power level multiplies with every correct answer.',
    stats: { speed: 99, power: 100, focus: 96 },
    robloxConfig: {
      faceType: 'saiyan',
      hairType: 'saiyan-huge',
      skinTone: '#ffd599'
    }
  },
  // 14. Anime: Ninja Naruto
  {
    id: 'ninja-naruto',
    name: 'Shinobi Blox',
    title: 'Hokage of Math',
    category: 'anime',
    tier: 'Legendary',
    price: 5200,
    primaryColor: '#f97316', // Orange Tracksuit
    secondaryColor: '#2563eb', // Blue Headband
    accentColor: '#fef08a',
    skinColor: '#fed7aa',
    hairColor: '#facc15',
    hasAura: true,
    auraColor: '#38bdf8',
    jerseyNumber: '忍',
    description: 'Leaf headband with whisker face! Believes in arithmetic dominance.',
    stats: { speed: 95, power: 96, focus: 94 },
    robloxConfig: {
      faceType: 'ninja',
      hairType: 'ninja-headband',
      skinTone: '#fed7aa'
    }
  },
  // 15. Superhero: Iron Armor
  {
    id: 'iron-hero',
    name: 'Iron Tech Blox',
    title: 'Nanotech Mark 85',
    category: 'superhero',
    tier: 'Legendary',
    price: 6500,
    primaryColor: '#b91c1c', // Crimson Gold
    secondaryColor: '#eab308',
    accentColor: '#38bdf8',
    skinColor: '#b91c1c',
    hairColor: '#b91c1c',
    hasAura: true,
    auraColor: '#38bdf8',
    jerseyNumber: '⚡',
    description: 'Armored titanium suit with glowing Arc Reactor chest plate.',
    stats: { speed: 96, power: 98, focus: 98 },
    robloxConfig: {
      faceType: 'cyborg',
      hairType: 'helmet',
      skinTone: '#b91c1c'
    }
  },
  // 16. Gaming: Sonic Blue Speed
  {
    id: 'sonic-speed',
    name: 'Sonic Speed Blox',
    title: 'Mach 5 Hedgehog',
    category: 'anime',
    tier: 'Epic',
    price: 3400,
    primaryColor: '#1d4ed8', // Royal Blue
    secondaryColor: '#ffffff',
    accentColor: '#dc2626',
    skinColor: '#fed7aa',
    hairColor: '#1d4ed8',
    jerseyNumber: '💨',
    description: 'Blue spikes and red sneakers. Solves division problems at lightning speed.',
    stats: { speed: 100, power: 86, focus: 88 },
    robloxConfig: {
      faceType: 'smirk',
      hairType: 'spiky',
      skinTone: '#fed7aa'
    }
  },
  // 17. Gaming: Lightning Pikachu
  {
    id: 'lightning-pika',
    name: 'Volt Blox',
    title: 'Electric Spark Rod',
    category: 'anime',
    tier: 'Rare',
    price: 2200,
    primaryColor: '#eab308', // Pikachu Yellow
    secondaryColor: '#ef4444', // Red cheeks
    accentColor: '#78350f',
    skinColor: '#facc15',
    hairColor: '#facc15',
    hasAura: true,
    auraColor: '#fef08a',
    jerseyNumber: '⚡',
    description: 'Electric cheeks and thunderbolts! Shocks hard math problems with ease.',
    stats: { speed: 93, power: 90, focus: 89 },
    robloxConfig: {
      faceType: 'electric',
      hairType: 'spiky',
      skinTone: '#facc15'
    }
  },
  // 18. Sci-Fi: Cyber Titan
  {
    id: 'cyber-titan',
    name: 'Cyber Mech Blox',
    title: 'Quantum Battlebot',
    category: 'superhero',
    tier: 'Rare',
    price: 1800,
    primaryColor: '#06b6d4', // Cyan Neon
    secondaryColor: '#0f172a',
    accentColor: '#ec4899',
    skinColor: '#0891b2',
    hairColor: '#06b6d4',
    jerseyNumber: '01',
    description: 'Futuristic Roblox cyborg with neon visor and quantum calculation matrix.',
    stats: { speed: 84, power: 97, focus: 96 },
    robloxConfig: {
      faceType: 'cyborg',
      hairType: 'helmet',
      skinTone: '#0891b2'
    }
  },
  // 19. Space: Astro Ranger
  {
    id: 'astro-ranger',
    name: 'Cosmic Blox Ranger',
    title: 'Galaxy Explorer',
    category: 'legend',
    tier: 'Rare',
    price: 1200,
    primaryColor: '#f8fafc', // Spacesuit White
    secondaryColor: '#f97316',
    accentColor: '#38bdf8',
    skinColor: '#38bdf8',
    hairColor: '#ffffff',
    jerseyNumber: '🚀',
    description: 'Gold-tinted helmet visor and lunar suit for solving problems in deep space.',
    stats: { speed: 82, power: 84, focus: 93 },
    robloxConfig: {
      faceType: 'cyborg',
      hairType: 'helmet',
      skinTone: '#38bdf8'
    }
  },
  // 20. Ancient Legend: Pharaoh King
  {
    id: 'pharaoh-king',
    name: 'Pharaoh Blox',
    title: 'Golden Pyramid King',
    category: 'legend',
    tier: 'Epic',
    price: 2800,
    primaryColor: '#ca8a04', // Ancient Gold
    secondaryColor: '#0284c7', // Royal Lapis
    accentColor: '#ffffff',
    skinColor: '#c68642',
    hairColor: '#09090b',
    hasCape: true,
    jerseyNumber: '👑',
    description: 'Ancient Egyptian pharaoh crown and golden sceptre. Pure geometric genius.',
    stats: { speed: 86, power: 93, focus: 99 },
    robloxConfig: {
      faceType: 'pharaoh',
      hairType: 'crown',
      skinTone: '#c68642',
      hasBeard: true
    }
  }
];

export const STAGES: StageEnvironment[] = [
  {
    id: 'stadium',
    name: 'Roblox Champions Arena',
    description: 'Iconic lush green Roblox pitch with chalk lines, floodlights & goalposts.',
    groundColor: '#16a34a',
    ambientColor: '#dcfce7',
    lightColor: '#ffffff',
    fogColor: '#f0fdf4',
    price: 0
  },
  {
    id: 'cyber',
    name: 'Neon Cyber Grid',
    description: 'High-tech Roblox cyber grid with glowing cyan pillars and floating particles.',
    groundColor: '#0f172a',
    ambientColor: '#06b6d4',
    lightColor: '#38bdf8',
    fogColor: '#020617',
    price: 500
  },
  {
    id: 'dojo',
    name: 'Bloxy Martial Dojo',
    description: 'Polished cedar wood platform with calming lanterns and bamboo fencing.',
    groundColor: '#78350f',
    ambientColor: '#fef3c7',
    lightColor: '#fffbeb',
    fogColor: '#fefce8',
    price: 800
  },
  {
    id: 'cosmos',
    name: 'Cosmic Blox Platform',
    description: 'Floating celestial platform among glowing constellations and star dust.',
    groundColor: '#1e1b4b',
    ambientColor: '#818cf8',
    lightColor: '#c084fc',
    fogColor: '#090514',
    price: 1200
  },
  {
    id: 'palace',
    name: 'Golden Throne Room',
    description: 'White marble floor with royal gold pillars and crimson velvet runner.',
    groundColor: '#e2e8f0',
    ambientColor: '#fef08a',
    lightColor: '#fef9c3',
    fogColor: '#fafaf9',
    price: 2000
  }
];

export const OUTFIT_SKINS = [
  { id: 'default', name: 'Original Bloxy Kit', price: 0, tag: 'Standard' },
  { id: 'gold', name: 'Golden Prestige Blox', price: 400, tag: 'Prestige', tint: '#eab308' },
  { id: 'stealth', name: 'Stealth Shadow Edition', price: 350, tag: 'Special', tint: '#18181b' },
  { id: 'neon', name: 'Cyberpunk Neon Glow', price: 600, tag: 'Cyber', tint: '#06b6d4' }
];

export const ACCESSORIES = [
  { id: 'none', name: 'None', price: 0, icon: '🚫' },
  { id: 'trophy', name: 'Golden Bloxy Trophy', price: 500, icon: '🏆', description: 'Iconic golden Roblox trophy floating beside you' },
  { id: 'flame-ball', name: 'Fire Blox Soccer Ball', price: 450, icon: '🔥', description: 'Flaming Roblox checkered soccer ball' },
  { id: 'halo', name: 'Golden Angel Halo', price: 600, icon: '😇', description: 'Glows brightly above the Roblox avatar head' },
  { id: 'wings', name: 'Cyber Blox Wings', price: 800, icon: '🪽', description: 'Beveled mechanical titanium wings' }
];

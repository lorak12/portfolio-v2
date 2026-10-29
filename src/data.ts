// Edytuj ten plik, aby uzupełnić portfolio własną treścią.

export const profile = {
  name: 'nakii',
  role: 'cfel',
  roles: ['Vibe coder', 'Token maxer'],
  available: true,
  location: 'Choroszcz, Polska',
  tagline:
    'fan Jarka (write jarek kutas)',
  about: [
    'Crazy? I was crazy once, they locked me in a room, a ruber room, a rubber room with rats, rats made me crazy, Crazy? I was crazy once, they locked me in a room, a ruber room, a rubber room with rats, rats made me crazy, Crazy? I was crazy once, they locked me in a room, a ruber room, a rubber room with rats, rats made me crazy, Crazy? I was crazy once, they locked me in a room, a ruber room, a rubber room with rats, rats made me crazy.',
  ],
  email: 'kradnedane123@gmail.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/lorak12' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/lorak12' },
  ],
}

export const stats = [
  { value: '67', label: 'Lat doświadczenia (104 B+ tokens burned)' },
  { value: '20+', label: 'Zaczetych side projektów' },
  { value: '∞', label: 'Wypitych monsterków' },
]

export type ProjectKind = 'board' | 'chart' | 'grid' | 'chat'

export const projects: {
  code: string
  title: string
  description: string
  stack: string[]
  href: string
  kind: ProjectKind
}[] = [
  {
    code: 'RYS-001',
    title: 'Kite',
    description:
      'Własny launcher i klient Minecrafta do zarządzania instalacjami, kontami, modami oraz profilami. Projekt obejmuje aplikację desktopową i modyfikacje klienta gry.',
    stack: ['Rust', 'Tauri', 'React', 'Java'],
    href: 'https://github.com/lorak12/kite-mc-client',
    kind: 'grid',
  },
  {
    code: 'RYS-002',
    title: 'Valmora',
    description:
      'Modułowy silnik RPG dla serwerów Minecraft Paper. Hot-reloadowalne moduły obsługują między innymi przedmioty, umiejętności, zadania, ekonomię i crafting.',
    stack: ['Java', 'Paper', 'Minecraft'],
    href: 'https://github.com/lorak12/Valmora',
    kind: 'board',
  },
  {
    code: 'RYS-003',
    title: 'Kira',
    description:
      'Osobisty asystent głosowy w formie nakładki desktopowej, z interfejsem Electron i integracją z modelami OpenAI.',
    stack: ['Electron', 'TypeScript', 'Python', 'OpenAI'],
    href: 'https://github.com/lorak12/kira',
    kind: 'chat',
  },
  {
    code: 'RYS-004',
    title: 'Add New by Artist',
    description:
      'Rozszerzenie Spicetify dodające na stronach artystów Spotify przycisk, który wyszukuje brakujące utwory i pozwala dodać je do playlisty.',
    stack: ['TypeScript', 'Spicetify', 'Spotify'],
    href: 'https://github.com/lorak12/add-new-by-artist',
    kind: 'chart',
  },
  {
    code: 'RYS-005',
    title: 'Quizly',
    description:
      'Aplikacja quizowa do nauki i rywalizacji: pozwala odkrywać quizy, tworzyć własne pytania i sprawdzać swoją wiedzę.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Supabase'],
    href: 'https://github.com/lorak12/quizly',
    kind: 'grid',
  },
  {
    code: 'RYS-006',
    title: 'vlrggapi',
    description:
      'Fork nieoficjalnego REST API dla vlr.gg, udostępniającego dane o wynikach meczów i aktualnościach z profesjonalnej sceny Valorant.',
    stack: ['Python', 'REST API', 'Valorant'],
    href: 'https://github.com/lorak12/vlrggapi',
    kind: 'chart',
  }
]

export const skills = [
  { part: 'React', category: 'Frontend', level: 90 },
  { part: 'TypeScript', category: 'Język', level: 85 },
  { part: 'HTML / CSS', category: 'Frontend', level: 90 },
  { part: 'Node.js', category: 'Backend', level: 70 },
  { part: 'SQL', category: 'Bazy danych', level: 65 },
  { part: 'Git', category: 'Narzędzia', level: 80 },
]

export const experience = [
  {
    rev: 'C',
    period: '2024 – obecnie',
    title: 'Frontend Developer',
    place: 'Nazwa firmy',
    note: 'Tworzenie i utrzymanie aplikacji React używanych przez klientów.',
  },
  {
    rev: 'B',
    period: '2023 – 2024',
    title: 'Junior Developer',
    place: 'Nazwa firmy',
    note: 'Dostarczanie funkcji w całym stosie i zwiększenie pokrycia testami.',
  },
  {
    rev: 'A',
    period: '2021 – 2023',
    title: 'Samouk i freelancer',
    place: 'Na własną rękę',
    note: 'Nauka rzemiosła przez własne projekty i drobne zlecenia dla klientów.',
  },
]


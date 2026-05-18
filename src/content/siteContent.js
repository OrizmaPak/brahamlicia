export const siteConfig = {
  name: 'Braham Licia Consulting',
  domain: 'https://www.brahamlicia.com',
  location: '38A Glover Road, Ikoyi 106104, Lagos, Nigeria',
  hours: 'Monday to Friday | 8:00 AM - 9:00 PM',
  tagline: 'Helping people, teams, and organisations grow with clarity, capacity, and practical direction.',
  primaryEmail: 'info@brahamlicia.com',
  secondaryEmail: 'customerservice@brahamlicia.com',
  primaryPhone: '08039613331',
  secondaryPhone: '+234 814 386 6334',
}

export const pageDefinitions = [
  { id: 'home', href: '/', output: 'index.html', label: 'Home' },
  { id: 'about', href: '/about/', output: 'about/index.html', label: 'About' },
  { id: 'services', href: '/services/', output: 'services/index.html', label: 'Services' },
  { id: 'contact', href: '/contact/', output: 'contact/index.html', label: 'Contact' },
  { id: 'faq', href: '/faq/', output: 'faq/index.html', label: 'FAQ' },
]

export const imageLibrary = {
  hero: {
    alt: 'Consultants reviewing growth plans around a conference table.',
    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1440&q=80',
  },
  about: {
    alt: 'A professional team collaborating during a strategy session.',
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1280&q=80',
  },
  collaboration: {
    alt: 'Consultants reviewing work together around laptops.',
    src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1280&q=80',
  },
  boardroom: {
    alt: 'A team in a focused boardroom planning session.',
    src: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=1280&q=80',
  },
  leadership: {
    alt: 'Senior professionals reviewing a presentation during an executive meeting.',
    src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1280&q=80',
  },
  strategy: {
    alt: 'Leaders in a focused planning discussion.',
    src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1280&q=80',
  },
  training: {
    alt: 'A facilitator leading a professional development workshop.',
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1280&q=80',
  },
  advisory: {
    alt: 'A project team reviewing documentation together.',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1280&q=80',
  },
  office: {
    alt: 'A premium office meeting room with calm natural light.',
    src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1280&q=80',
  },
  workspace: {
    alt: 'A refined workspace used for strategic planning sessions.',
    src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1280&q=80',
  },
  insightDesk: {
    alt: 'Strategy notes and planning materials arranged across a consulting desk.',
    src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1280&q=80',
  },
}

export const primaryNavigation = [
  { href: '/', id: 'home', label: 'Home' },
  { href: '/about/', id: 'about', label: 'About' },
  { href: '/services/', id: 'services', label: 'Services' },
  { href: '/#faq', id: 'faq', label: 'FAQ' },
]

export const aboutMenuItems = [
  { href: '/about/', label: 'Overview' },
  { href: '/about/#who-we-serve', label: 'Who We Serve' },
  { href: '/about/#insights', label: 'Insights' },
]

export const homeHighlights = [
  'Clarity-led growth planning',
  'People-centred advisory',
  'Learning experiences with practical follow-through',
]

export const heroMoments = [
  {
    id: 'focus',
    label: 'Focus',
    title: 'Strategy-led advisory',
    feeling: 'Calm strategic control in complex moments.',
    categoryLabel: 'Capabilities',
    categoryTitle: 'Business & Organisational Consulting',
    panelNote: 'Strategy, structure, growth.',
    image: imageLibrary.strategy,
    imageCaption: 'Boardroom clarity with implementation discipline.',
    points: [
      'Strategic direction and positioning',
      'Workflow and structure review',
    ],
  },
  {
    id: 'execution',
    label: 'Execution',
    title: 'Structured delivery support',
    feeling: 'Visible progress with disciplined coordination.',
    categoryLabel: 'Delivery path',
    categoryTitle: 'Institutional & Project Advisory',
    panelNote: 'Planning, coordination, delivery.',
    image: imageLibrary.advisory,
    imageCaption: 'Structured delivery support for projects that need traction.',
    points: [
      'Project planning and documentation',
      'Implementation guidance and review',
    ],
  },
  {
    id: 'capability',
    label: 'Capability',
    title: 'Training that translates',
    feeling: 'Confident people with sharper performance on the ground.',
    categoryLabel: 'Capabilities',
    categoryTitle: 'Capacity Building & Professional Development',
    panelNote: 'Learning, leadership, performance.',
    image: imageLibrary.training,
    imageCaption: 'Practical learning designed to change real performance.',
    points: [
      'Leadership and team development',
      'Custom sessions for real needs',
    ],
  },
]

export const whyChooseUs = [
  {
    description: 'We design solutions around real people, real needs, and real working environments.',
    title: 'Human-centred approach',
  },
  {
    description: 'Our work is built for implementation, not theory alone.',
    title: 'Practical and actionable',
  },
  {
    description: 'We bring structure without losing the flexibility each client context requires.',
    title: 'Structured but flexible',
  },
  {
    description: 'Everything we do is aimed at improving clarity, capacity, and long-term effectiveness.',
    title: 'Built for meaningful results',
  },
]

export const processSteps = [
  {
    description: 'We begin by understanding your context, goals, challenges, and priorities.',
    number: '01',
    title: 'Discover',
  },
  {
    description: 'We shape a focused plan, intervention, or consulting pathway around your needs.',
    number: '02',
    title: 'Design',
  },
  {
    description: 'We deliver through advisory support, learning experiences, project guidance, or structured recommendations.',
    number: '03',
    title: 'Deliver',
  },
  {
    description: 'We help refine outcomes and support stronger long-term adoption.',
    number: '04',
    title: 'Strengthen',
  },
]

export const serviceOfferings = [
  {
    anchor: 'business-organisational-consulting',
    category: 'Strategy & Structure',
    ctaLabel: 'Book a Strategy Session',
    image: imageLibrary.strategy,
    intro:
      'Strong organisations need more than ambition. They need clarity, alignment, and systems that support growth. This service helps clients strengthen internal structure, improve strategic focus, and create better pathways for performance.',
    outcomes:
      'Clients gain stronger internal clarity, more effective workflows, better strategic focus, and a clearer foundation for growth.',
    points: [
      'Business strategy support',
      'Operational improvement',
      'Process and workflow review',
      'Team alignment support',
      'Growth planning',
      'Structure and systems strengthening',
    ],
    summary:
      'We help businesses and teams improve structure, strategic direction, operational clarity, and day-to-day effectiveness.',
    title: 'Business & Organisational Consulting',
  },
  {
    anchor: 'capacity-building-professional-development',
    category: 'Learning & Leadership',
    ctaLabel: 'Request a Training Consultation',
    image: imageLibrary.training,
    intro:
      'Growth is stronger when people are equipped to lead, contribute, and perform effectively. We design practical learning experiences that strengthen competence, confidence, and capability through relevant, engaging interventions.',
    outcomes:
      'Clients gain stronger teams, more confident professionals, improved leadership capacity, and learning experiences that translate into better performance.',
    points: [
      'Workshops and seminars',
      'Training programmes',
      'Leadership development',
      'Team learning sessions',
      'Professional growth support',
      'Customised learning interventions',
    ],
    summary:
      'We design and deliver training, workshops, and learning interventions that improve skills, leadership, and team performance.',
    title: 'Capacity Building & Professional Development',
  },
  {
    anchor: 'institutional-project-advisory',
    category: 'Programme & Delivery Support',
    ctaLabel: 'Talk to Us',
    image: imageLibrary.advisory,
    intro:
      'Institutions and project teams often need more than good ideas. They need planning, structure, documentation, and support that make implementation more effective. We help shape initiatives clearly and strengthen the way they are delivered.',
    outcomes:
      'Clients gain more structured project pathways, better coordination, clearer documentation, stronger delivery support, and a more confident approach to implementation.',
    points: [
      'Programme and project planning',
      'Documentation support',
      'Stakeholder coordination',
      'Project structure design',
      'Implementation support',
      'Review and improvement guidance',
    ],
    summary:
      'We support institutions and project teams with planning, coordination, documentation, and strategic guidance for stronger delivery.',
    title: 'Institutional & Project Advisory',
  },
]

export const servicesMenuItems = [
  { href: '/services/', label: 'Service Overview' },
  ...serviceOfferings.map((service) => ({
    href: `/services/#${service.anchor}`,
    label: service.title,
  })),
]

export const audiences = [
  {
    description:
      'For growing businesses that need stronger systems, clearer structure, and better strategic support.',
    title: 'Businesses & Founders',
  },
  {
    description:
      'For schools, associations, NGOs, and organisations seeking stronger delivery, team development, and structured support.',
    title: 'Institutions & Organisations',
  },
  {
    description:
      'For teams and leaders looking to sharpen direction, strengthen leadership effectiveness, and build healthier collaboration.',
    title: 'Teams & Leaders',
  },
  {
    description:
      'For professionals seeking development, refinement, and stronger effectiveness in the way they lead, work, communicate, and grow.',
    title: 'Professionals',
  },
]

export const values = [
  {
    description: 'We believe clarity creates confidence, alignment, and better decisions.',
    title: 'Clarity',
  },
  {
    description: 'We hold ourselves to a high standard of quality, structure, and excellence.',
    title: 'Professionalism',
  },
  {
    description: 'We are committed to helping clients evolve in ways that are meaningful and sustainable.',
    title: 'Growth',
  },
  {
    description: 'We focus on solutions that can be applied in real life, not just admired in theory.',
    title: 'Practicality',
  },
  {
    description: 'We believe the best consulting work strengthens people as much as it improves systems.',
    title: 'People-Centred Impact',
  },
]

export const insights = [
  {
    category: 'Organisational Growth',
    excerpt:
      'When organisations begin to grow, complexity tends to grow with them. Clarity helps reduce confusion, sharpen decisions, and create the internal structure that growth depends on.',
    title: 'Why clarity is one of the most valuable assets in any growing organisation',
  },
  {
    category: 'Capacity Building',
    excerpt:
      'Capacity building is strongest when it connects to real goals, real performance gaps, and real opportunities for development rather than functioning as a one-time event.',
    title: 'Capacity building is not just training. It is a pathway to stronger performance',
  },
  {
    category: 'Strategy & Systems',
    excerpt:
      'Better systems are not about rigidity. They make good work easier to sustain, clearer to coordinate, and more meaningful to deliver over time.',
    title: 'How better systems create room for more meaningful impact',
  },
]

export const faqItems = [
  {
    answer:
      'We work with businesses, institutions, teams, and professionals seeking consulting support, capacity building, or structured advisory services.',
    question: 'What kind of clients do you work with?',
  },
  {
    answer:
      'Yes. Our services can be tailored to suit the specific needs, context, and goals of each client.',
    question: 'Do you offer customised services?',
  },
  {
    answer:
      'Yes. We can deliver consulting sessions, advisory support, and training engagements both remotely and in person, depending on the nature of the work.',
    question: 'Can you work with teams remotely?',
  },
  {
    answer:
      'You do not need to be fully sure before reaching out. We can help identify the most suitable service path during an initial conversation.',
    question: 'How do I know which service I need?',
  },
  {
    answer:
      'We support both one-time engagements and longer-term consulting relationships depending on your goals and scope.',
    question: 'Do you work on one-off projects or long-term engagements?',
  },
]

export const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/about/#who-we-serve', label: 'Who We Serve' },
  { href: '/about/#insights', label: 'Insights' },
  { href: '/services/', label: 'Services' },
  { href: '/contact/', label: 'Contact' },
  { href: '/#faq', label: 'FAQ' },
]

export const testimonials = [
  {
    quote:
      'Having the right technical and product guidance helped us move faster without losing quality or strategic focus.',
    author: 'Victor Awotidebe',
    role: 'CTO',
    organisation: 'FilmMakers Mart',
    image: { alt: 'Default profile avatar', src: 'https://www.gravatar.com/avatar/?d=mp&s=64' },
  },
  {
    quote:
      'The advisory support gave us stronger clarity on product and growth priorities at a stage where every decision mattered.',
    author: 'Samuel Ogbonyomi',
    role: 'CEO',
    organisation: 'PipeOps',
    image: { alt: 'Default profile avatar', src: 'https://www.gravatar.com/avatar/?d=mp&s=64' },
  },
  {
    quote:
      'The development process became more intentional, more scalable, and much easier to align with the product we wanted to build.',
    author: 'Oludamola Olabode',
    role: 'CEO',
    organisation: 'LeaseCircle',
    image: { alt: 'Default profile avatar', src: 'https://www.gravatar.com/avatar/?d=mp&s=64' },
  },
  {
    quote:
      'We needed sharper execution and a stronger product foundation. The support helped us think long term from day one.',
    author: 'Chiekezie Nkechukwu',
    role: 'COO',
    organisation: 'AptResponse',
    image: { alt: 'Default profile avatar', src: 'https://www.gravatar.com/avatar/?d=mp&s=64' },
  },
]

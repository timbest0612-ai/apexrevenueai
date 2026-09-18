// Universal Niche & Intent Inference Engine
// Translates ANY user goal ("What do I want to do?") and ANY niche/offering into targeted prospect buyer personas, active pain points, and personalized pitch templates.

export interface InferredTargeting {
  userGoal: string;
  niche: string;
  targetAudience: string;
  painPoints: string[];
  defaultPainPoint: string;
  solutionFitReason: string;
  targetRoles: { title: string; seniority: string; dept: string }[];
  companyArchetypes: string[];
  industry: string;
  defaultSubject: string;
  defaultPitchBody: string;
}

export const POPULAR_GOALS = [
  'I want to generate content for my business',
  'I want to sell marketing, ads & customer acquisition services',
  'I want to sell web design, development & software',
  'I want to get high-ticket coaching & consulting clients',
  'I want to sell products online (E-commerce / Retail / Physical)',
  'I want to sell B2B corporate tools, software & solutions',
  'I want to sell health, fitness & wellness programs',
  'I want to sell real estate, properties & mortgage services'
];

export const POPULAR_NICHES = [
  'Fitness & Online Nutrition Coaching',
  'Content Creation, Video Editing & YouTube Growth',
  'B2B SaaS CRM & Automation Tools',
  'E-Commerce Fashion, Apparel & Clean Beauty',
  'Local Services (Dental, Medical Clinics, HVAC)',
  'Commercial Real Estate & Luxury Property',
  'Accounting, Tax & Financial Advisory',
  'Artisan Handcrafted & Sustainable Goods'
];

export function inferNicheTargeting(
  userGoalRaw: string = 'I want to generate content for my business',
  nicheRaw: string = 'Digital Content & Brand Growth',
  targetCategory: 'BUSINESS' | 'INDIVIDUALS' = 'BUSINESS'
): InferredTargeting {
  const goal = userGoalRaw.trim() || 'I want to generate content for my business';
  const niche = nicheRaw.trim() || 'Content Marketing & Brand Growth';
  const text = `${goal} ${niche}`.toLowerCase();

  // 1. Content Generation & Media Creation (The user's key example)
  if (text.includes('content') || text.includes('video') || text.includes('reels') || text.includes('youtube') || text.includes('tiktok') || text.includes('podcast') || text.includes('social media')) {
    const audience = text.includes('fitness')
      ? 'Fitness Coaches, Gym Owners & Wellness Creators'
      : text.includes('real estate')
      ? 'Real Estate Brokers & Top Producing Realtors'
      : text.includes('brand') || text.includes('ecommerce')
      ? 'DTC Brand Founders & Direct-to-Consumer Marketers'
      : 'Business Founders, Solo Creators & Agency Directors';

    const painPoints = [
      'Struggling to produce consistent video content & reels without burning out',
      'High cost and slow turnaround times of hiring unreliable freelance video editors',
      'Low follower-to-client conversion rate and zero qualified inbound sales inquiries',
      'Lacking time for scripting, editing, and multi-channel content distribution',
      'Falling behind competitors who post daily high-converting short-form content'
    ];

    const roles = [
      { title: 'Founder & Head Creator', seniority: 'Owner / Founder', dept: 'Content & Media' },
      { title: 'Head of Brand & Content Marketing', seniority: 'VP / Director', dept: 'Marketing' },
      { title: 'Lead Content Strategist', seniority: 'Lead', dept: 'Creative Strategy' },
      { title: 'Executive Director & Host', seniority: 'Executive', dept: 'Operations' },
      { title: 'Creative Director', seniority: 'Director', dept: 'Media Production' }
    ];

    const archetypes = ['Media Studio', 'Creative Agency', 'Digital Brand', 'Creator Hub', 'Productions'];

    return {
      userGoal: goal,
      niche,
      targetAudience: audience,
      painPoints,
      defaultPainPoint: painPoints[0],
      solutionFitReason: 'Requires automated high-velocity content production to generate 15-30 qualified inbound buyers monthly',
      targetRoles: roles,
      companyArchetypes: archetypes,
      industry: 'Digital Media & Content Production',
      defaultSubject: 'Idea for eliminating content creation bottlenecks at {{company}}',
      defaultPitchBody: `Hi {{first_name}},\n\nI noticed {{company}} is creating great things for {{target_audience}} in {{what_they_sell}}.\n\nMany leaders we speak with in {{city}} tell us their biggest bottleneck is {{pain_point}}.\n\nWe built an automated system that handles end-to-end content production and distribution, freeing up your time while driving qualified inbound demand.\n\nWould you be open to a quick 5-minute chat this week on how we can implement this for {{company}}?\n\nBest regards,\n{{my_offer}}`
    };
  }

  // 2. Web Design, Shopify & Software Development
  if (text.includes('web') || text.includes('design') || text.includes('shopify') || text.includes('developer') || text.includes('app') || text.includes('software dev')) {
    const audience = 'E-Commerce Brands & Local Business Owners';
    const painPoints = [
      'Outdated website with high bounce rates & poor mobile checkout conversions',
      'Slow site load speeds causing cart abandonment and wasted advertising budget',
      'Lacking automated CRM integration, booking calendars, and customer retention flows',
      'Inability to customize digital storefront without paying high agency retainer fees'
    ];

    const roles = [
      { title: 'Founder & E-Commerce Director', seniority: 'Founder', dept: 'E-Commerce' },
      { title: 'Managing Director & Partner', seniority: 'Executive', dept: 'Management' },
      { title: 'Head of Digital Experience', seniority: 'Director', dept: 'Digital Growth' },
      { title: 'Marketing & Web Operations Lead', seniority: 'Lead', dept: 'Technology' }
    ];

    return {
      userGoal: goal,
      niche,
      targetAudience: audience,
      painPoints,
      defaultPainPoint: painPoints[0],
      solutionFitReason: 'Needs modern, high-converting digital infrastructure to maximize revenue per visitor',
      targetRoles: roles,
      companyArchetypes: ['Store', 'Digital', 'Enterprises', 'Direct', 'Brands'],
      industry: 'Web & Digital Commerce',
      defaultSubject: 'Quick question about {{company}}\'s website conversion rate',
      defaultPitchBody: `Hi {{first_name}},\n\nI was looking at {{company}}\'s storefront while researching {{what_they_sell}} in {{city}}.\n\nI noticed a few immediate opportunities to address {{pain_point}} that could quickly lift conversions.\n\nWe specialize in {{my_offer}} for {{target_audience}}, helping brands double their checkout revenue.\n\nWould you be against a 5-minute review of what we found?\n\nBest,\n{{first_name}}`
    };
  }

  // 3. Health, Fitness, Gym & Wellness Coaching
  if (text.includes('fitness') || text.includes('gym') || text.includes('nutrition') || text.includes('wellness') || text.includes('health') || text.includes('trainer')) {
    const audience = 'Gym Owners, Personal Trainers, Wellness Clinics & Online Coaches';
    const painPoints = [
      'Struggling to fill high-ticket client coaching roster consistently each month',
      'High client mid-program churn and lack of automated progress tracking systems',
      'Wasting 10+ hours weekly on manual DMs, scheduling and payment follow-ups',
      'Difficulty competing with franchised fitness studios on local advertising spend'
    ];

    const roles = [
      { title: 'Head Coach & Founder', seniority: 'Owner / Founder', dept: 'Fitness Operations' },
      { title: 'Studio Director & Wellness Lead', seniority: 'Director', dept: 'Operations' },
      { title: 'Lead Nutrition & Performance Specialist', seniority: 'Lead', dept: 'Client Success' },
      { title: 'Managing Partner', seniority: 'Executive', dept: 'Management' }
    ];

    return {
      userGoal: goal,
      niche,
      targetAudience: audience,
      painPoints,
      defaultPainPoint: painPoints[0],
      solutionFitReason: 'Seeking predictable client acquisition and streamlined client delivery to scale retainers',
      targetRoles: roles,
      companyArchetypes: ['Athletics', 'Fitness Club', 'Performance Lab', 'Wellness Studio', 'Health Hub'],
      industry: 'Health, Wellness & Fitness',
      defaultSubject: 'Idea to help {{company}} enroll 15+ new coaching clients',
      defaultPitchBody: `Hi {{first_name}},\n\nLove what you\'re building with {{company}} in {{city}}.\n\nMost fitness and wellness leaders we talk to mention {{pain_point}}.\n\nWe provide {{my_offer}} specifically designed for {{target_audience}}, adding $10k-$30k in monthly recurring memberships.\n\nOpen to seeing how this works for {{company}}?\n\nWarm regards`
    };
  }

  // 4. Physical Products, E-Commerce, Retail & Fashion
  if (text.includes('product') || text.includes('ecommerce') || text.includes('e-commerce') || text.includes('retail') || text.includes('fashion') || text.includes('jewelry') || text.includes('apparel') || text.includes('goods')) {
    const audience = 'Direct-to-Consumer Brands, Boutique Retailers & Wholesale Buyers';
    const painPoints = [
      'Rising Meta and TikTok ad customer acquisition costs compressing gross margins',
      'Low repeat customer lifetime value (LTV) and underdeveloped SMS/email retention flows',
      'Supply chain inventory stockouts and delayed wholesale fulfillment cycles',
      'Struggling to get featured in premium retail boutiques and multi-brand department stores'
    ];

    const roles = [
      { title: 'Founder & Creative Director', seniority: 'Founder', dept: 'Brand & Merchandising' },
      { title: 'VP of Growth & E-Commerce', seniority: 'Executive', dept: 'Sales & Growth' },
      { title: 'Retail Procurement Director', seniority: 'Director', dept: 'Wholesale & Buying' },
      { title: 'Head of Brand Operations', seniority: 'Lead', dept: 'Operations' }
    ];

    return {
      userGoal: goal,
      niche,
      targetAudience: audience,
      painPoints,
      defaultPainPoint: painPoints[0],
      solutionFitReason: 'Requires high-ROAS marketing and direct wholesale distributor acquisition to boost margins',
      targetRoles: roles,
      companyArchetypes: ['Brand', 'Apparel Co', 'Boutique', 'Goods', 'Collective'],
      industry: 'Retail, E-Commerce & Consumer Brands',
      defaultSubject: 'Customer acquisition and wholesale retail for {{company}}',
      defaultPitchBody: `Hi {{first_name}},\n\nI came across {{company}} while reviewing exceptional brands in {{what_they_sell}}.\n\nWith rising ad costs right now, many brands struggle with {{pain_point}}.\n\nWe help {{target_audience}} solve this with {{my_offer}}, generating profitable new revenue without ad burn.\n\nWould you be open to a brief conversation this week?\n\nBest regards`
    };
  }

  // 5. Coaching, Consulting & Professional Services
  if (text.includes('coach') || text.includes('consulting') || text.includes('agency') || text.includes('advisor') || text.includes('client')) {
    const audience = 'Independent Consultants, Agency Principals & Executive Advisors';
    const painPoints = [
      'Feast-or-famine revenue cycles and reliance on unpredictable word-of-mouth referrals',
      'Difficulty closing $5k-$25k monthly client retainers without exhaustive manual pitching',
      'Lacking a dedicated outbound engine that books qualified decision-maker calls on autopilot',
      'Spending too much time on prospecting instead of delivering high-impact consulting'
    ];

    const roles = [
      { title: 'Managing Partner & Principal', seniority: 'Founder / Partner', dept: 'Advisory Practice' },
      { title: 'Practice Director', seniority: 'Executive', dept: 'Client Operations' },
      { title: 'Senior Strategy Consultant', seniority: 'Senior', dept: 'Consulting' },
      { title: 'Head of Business Development', seniority: 'Director', dept: 'Business Development' }
    ];

    return {
      userGoal: goal,
      niche,
      targetAudience: audience,
      painPoints,
      defaultPainPoint: painPoints[0],
      solutionFitReason: 'Wants guaranteed qualified sales calls with buyers ready to sign high-ticket contracts',
      targetRoles: roles,
      companyArchetypes: ['Partners', 'Consulting Group', 'Advisors', 'Global Advisory', 'Associates'],
      industry: 'Professional & Business Consulting',
      defaultSubject: 'Predictable $10k+ client pipeline for {{company}}',
      defaultPitchBody: `Hi {{first_name}},\n\nNoticed {{company}}\'s impressive work in {{what_they_sell}}.\n\nConsulting leaders frequently share that their main growth hurdle is {{pain_point}}.\n\nWe provide {{my_offer}} tailored for {{target_audience}}, helping firms sign 3-5 new high-ticket retainers monthly.\n\nCould we connect for 5 minutes this week?\n\nBest`
    };
  }

  // 6. Real Estate, Properties & Housing
  if (text.includes('real estate') || text.includes('realtor') || text.includes('property') || text.includes('housing') || text.includes('mortgage') || text.includes('broker')) {
    const audience = 'Real Estate Brokers, Commercial Property Managers & Agency Owners';
    const painPoints = [
      'High cost per lead on portal ads (Zillow/Realtor) with poor lead contact rates',
      'Struggling to win exclusive seller listings in competitive metropolitan markets',
      'Lacking automated follow-up sequences for high-net-worth property investors',
      'Time wasted manually coordinating showings, tenant applications and contracts'
    ];

    const roles = [
      { title: 'Principal Broker & Owner', seniority: 'Owner / Broker', dept: 'Brokerage' },
      { title: 'Managing Director of Real Estate', seniority: 'Executive', dept: 'Commercial Acquisitions' },
      { title: 'Senior Property Asset Manager', seniority: 'Director', dept: 'Asset Management' },
      { title: 'Head of Residential Sales', seniority: 'Lead', dept: 'Sales' }
    ];

    return {
      userGoal: goal,
      niche,
      targetAudience: audience,
      painPoints,
      defaultPainPoint: painPoints[0],
      solutionFitReason: 'Needs qualified exclusive seller listing appointments and verified high-net-worth investors',
      targetRoles: roles,
      companyArchetypes: ['Properties', 'Realty Group', 'Capital & Estates', 'Real Estate Partners', 'Holdings'],
      industry: 'Real Estate & Property Development',
      defaultSubject: 'Exclusive listing pipeline for {{company}} in {{city}}',
      defaultPitchBody: `Hi {{first_name}},\n\nI was admiring {{company}}\'s portfolio of properties across {{city}}.\n\nMany brokerage leaders we connect with are dealing with {{pain_point}}.\n\nWe deliver {{my_offer}} specifically for {{target_audience}}, generating verified seller inquiries on autopilot.\n\nDo you have 5 minutes this week to explore this?\n\nBest`
    };
  }

  // 7. Universal Fallback for ANY Niche & Industry
  // Generates clean, domain-contextual targeting from the raw user prompt
  const cleanNicheWords = niche.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(w => w.length > 2);
  const coreNiche = cleanNicheWords.slice(0, 3).join(' ') || 'Online Commerce & Services';
  const nicheKeyword = cleanNicheWords[0] || 'Business';

  const universalAudience = targetCategory === 'INDIVIDUALS'
    ? `Individuals, Independent Buyers & Specialists in ${coreNiche}`
    : `Business Owners, Directors & Executives in ${coreNiche}`;

  const universalPainPoints = [
    `Struggling with high customer acquisition cost and unpredictable revenue in ${coreNiche}`,
    `Lacking an automated system to consistently attract and convert buyers looking for ${coreNiche}`,
    `Losing valuable deals and pipeline to manual follow-up delays and operational bottlenecks`,
    `Difficulty standing out against established market competitors in ${coreNiche}`,
    `Wasting time on fragmented tools instead of focusing on core delivery and sales`
  ];

  const universalRoles = [
    { title: `Founder & Head of ${nicheKeyword}`, seniority: 'Founder', dept: 'Executive Management' },
    { title: `Managing Director`, seniority: 'Executive', dept: 'Operations' },
    { title: `VP of Commercial Growth`, seniority: 'VP', dept: 'Sales & Growth' },
    { title: `Lead ${nicheKeyword} Specialist`, seniority: 'Lead', dept: 'Core Services' }
  ];

  const universalArchetypes = [`${nicheKeyword} Group`, `${nicheKeyword} Co`, `${nicheKeyword} Solutions`, `${nicheKeyword} Studio`, `${nicheKeyword} Enterprises`];

  return {
    userGoal: goal,
    niche: coreNiche,
    targetAudience: universalAudience,
    painPoints: universalPainPoints,
    defaultPainPoint: universalPainPoints[0],
    solutionFitReason: `Actively experiencing friction with: "${universalPainPoints[0]}" in ${coreNiche}`,
    targetRoles: universalRoles,
    companyArchetypes: universalArchetypes,
    industry: coreNiche,
    defaultSubject: `Quick idea regarding {{company}}\'s growth in ${coreNiche}`,
    defaultPitchBody: `Hi {{first_name}},\n\nI was reviewing {{company}}\'s work in ${coreNiche} across {{city}}.\n\nMany organizations in {{target_audience}} share that {{pain_point}} is their main bottleneck.\n\nWe provide {{my_offer}}, which directly resolves this friction to accelerate revenue.\n\nWould you be open to a quick 5-minute conversation on how this would work for {{company}}?\n\nBest regards,\n{{first_name}}`
  };
}

// Social Media Platforms definition
export const ALL_SOCIAL_PLATFORMS = [
  { id: 'all', name: 'All Social & Forums', iconName: 'Globe', badge: 'Omni-Channel' },
  { id: 'linkedin', name: 'LinkedIn', iconName: 'Linkedin', badge: 'B2B & Execs' },
  { id: 'twitter', name: 'X (Twitter)', iconName: 'Twitter', badge: 'Tech & Founders' },
  { id: 'facebook', name: 'Facebook Groups & Pages', iconName: 'Facebook', badge: 'Communities' },
  { id: 'youtube', name: 'YouTube Channels & Creators', iconName: 'Youtube', badge: 'Video & Podcasts' },
  { id: 'tiktok', name: 'TikTok Creators & Brands', iconName: 'Video', badge: 'E-com & DTC' },
  { id: 'instagram', name: 'Instagram Creators & SMBs', iconName: 'Instagram', badge: 'Visual & DMs' },
  { id: 'pinterest', name: 'Pinterest Storefronts', iconName: 'Bookmark', badge: 'Shopping & Decor' },
  { id: 'forums', name: 'Forums (Reddit, Quora, Discord)', iconName: 'MessageSquare', badge: 'Pain Threads' },
  { id: 'snapchat', name: 'Snapchat Brands & Spotlight', iconName: 'Zap', badge: 'Gen Z & Apps' }
] as const;

export interface ProductSocialProfile {
  productName: string;
  productDescription: string;
  detectedNiches: string[];
  corePainSolved: string;
  idealPersona: string;
  socialSearchQueries: Record<string, string[]>;
}

export function analyzeProductProfile(
  productName: string = 'Apex AI Revenue Engine',
  productDescription: string = 'Automated 100k verified lead mining, zero-bounce email verification, and 1-click mass pitch to eliminate domain burn and 10x meetings booked',
  userNiches: string[] = ['B2B SaaS', 'Digital Agencies', 'E-commerce Brands']
): ProductSocialProfile {
  const pName = productName.trim() || 'Apex Revenue AI Engine';
  const pDesc = productDescription.trim() || 'Customer acquisition, lead mining, automated outreach & high-ticket deal closing software';
  const combined = `${pName} ${pDesc} ${userNiches.join(' ')}`.toLowerCase();

  let corePain = 'Struggling with slow manual prospecting, high customer acquisition costs, and inconsistent pipeline';
  let idealPersona = 'Business Owners, Growth Directors & Founders';

  if (combined.includes('email') || combined.includes('pitch') || combined.includes('outbound') || combined.includes('deliverability') || combined.includes('spam')) {
    corePain = 'Burning sending domains, hitting spam folders, and wasting hours manually hunting decision maker emails';
    idealPersona = 'VP of Sales, CROs, SDR Leaders & Agency Founders';
  } else if (combined.includes('ecommerce') || combined.includes('shopify') || combined.includes('store') || combined.includes('physical') || combined.includes('brand')) {
    corePain = 'Skyrocketing ad costs, low average order values, and abandoned checkouts eating away profit margins';
    idealPersona = 'DTC Brand Owners, E-commerce Directors & Shopify Merchants';
  } else if (combined.includes('content') || combined.includes('video') || combined.includes('reels') || combined.includes('youtube') || combined.includes('edit')) {
    corePain = 'Expensive and slow freelance video editors causing creator burnout and inconsistent social reach';
    idealPersona = 'Content Creators, Media Agency Founders & YouTube Channel Operators';
  } else if (combined.includes('crypto') || combined.includes('web3') || combined.includes('token') || combined.includes('defi')) {
    corePain = 'Difficulty attracting high-net-worth liquidity providers and navigating Telegram noise to reach real investors';
    idealPersona = 'Web3 Protocol Founders, Tokenomics Leads & DAO Growth Heads';
  } else if (combined.includes('real estate') || combined.includes('property') || combined.includes('mortgage')) {
    corePain = 'Paying huge fees for shared Zillow/portal leads that never pick up the phone and losing exclusive listings';
    idealPersona = 'Managing Brokers, Real Estate Team Leads & Commercial Investors';
  }

  const queries: Record<string, string[]> = {
    linkedin: [
      `"${corePain.slice(0, 30)}" "founder" OR "VP Sales"`,
      `"tired of" Apollo OR ZoomInfo OR "cold outreach"`,
      `"recommendations for" ${userNiches[0] || 'software'}`
    ],
    twitter: [
      `"anyone know a tool for" ${userNiches[0] || 'pipeline'}`,
      `"struggling with" OR "frustrated by" ${pName.slice(0, 20)}`,
      `"need a better solution for" ${corePain.slice(0, 25)}`
    ],
    facebook: [
      `Group post: "How do you guys handle ${corePain.slice(0, 35)}?"`,
      `"Can anyone recommend software for" ${pName}`
    ],
    youtube: [
      `Comments on "How to solve ${corePain.slice(0, 30)}"`,
      `"Looking for an alternative to" legacy tools`
    ],
    tiktok: [
      `#${(userNiches[0] || 'business').replace(/[^a-zA-Z]/g, '')} "behind the scenes struggling with"`,
      `"My biggest problem running my business"`
    ],
    instagram: [
      `DMs and comment complaints about ${corePain.slice(0, 25)}`,
      `Bio: "Helping brands solve" looking for partner tools`
    ],
    pinterest: [
      `Store boards searching for ${pName} solutions`,
      `Shopify conversion and order bump pins`
    ],
    forums: [
      `[r/SaaS] "How are you guys solving ${corePain.slice(0, 35)}?"`,
      `[IndieHackers] "Need feedback on alternatives for ${pName}"`
    ],
    snapchat: [
      `Public stories: "Anyone know how to fix this bottleneck?"`
    ]
  };

  return {
    productName: pName,
    productDescription: pDesc,
    detectedNiches: userNiches.length > 0 ? userNiches : ['B2B Solutions', 'Digital Growth'],
    corePainSolved: corePain,
    idealPersona,
    socialSearchQueries: queries
  };
}


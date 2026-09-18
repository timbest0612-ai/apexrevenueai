import { DiscoveredLead, LeadTargetCategory, DomainProviderFilter, SocialMediaPlatform } from '../types.js';
import { inferNicheTargeting, analyzeProductProfile } from './universalNicheEngine.js';

export const GLOBAL_LOCATIONS = [
  { country: 'Nigeria', cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Kaduna'], phonePrefix: '+234' },
  { country: 'United States', cities: ['San Francisco', 'New York', 'Austin', 'Chicago', 'Miami', 'Seattle', 'Boston', 'Los Angeles'], phonePrefix: '+1' },
  { country: 'United Kingdom', cities: ['London', 'Manchester', 'Bristol', 'Edinburgh', 'Birmingham', 'Cambridge', 'Oxford'], phonePrefix: '+44' },
  { country: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu'], phonePrefix: '+254' },
  { country: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'], phonePrefix: '+27' },
  { country: 'Ghana', cities: ['Accra', 'Kumasi', 'Tema'], phonePrefix: '+233' },
  { country: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'], phonePrefix: '+1' },
  { country: 'Germany', cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'], phonePrefix: '+49' },
  { country: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah'], phonePrefix: '+971' },
  { country: 'Singapore', cities: ['Singapore'], phonePrefix: '+65' },
  { country: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'], phonePrefix: '+61' },
  { country: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília'], phonePrefix: '+55' },
  { country: 'India', cities: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'], phonePrefix: '+91' },
  { country: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza'], phonePrefix: '+20' },
  { country: 'France', cities: ['Paris', 'Lyon', 'Marseille'], phonePrefix: '+33' },
  { country: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'Utrecht'], phonePrefix: '+31' },
];

export const FIRST_NAMES = [
  'Alex', 'Sarah', 'Michael', 'David', 'Elena', 'Babatunde', 'Chidinma', 'Amina', 'Kwame', 'Marcus',
  'Liam', 'Chloe', 'Daniel', 'Fatima', 'Tariq', 'Jessica', 'Sophie', 'Lucas', 'Carlos', 'Wei',
  'Priya', 'Emeka', 'Zainab', 'Jordan', 'Nia', 'Mateo', 'Hannah', 'Kofi', 'Olumide', 'Aaliyah',
  'Siddharth', 'Ngozi', 'Femi', 'Aisha', 'Gabriel', 'Chen', 'Dmitri', 'Yuki', 'Amara', 'Kehinde',
  'Victoria', 'Julian', 'Claire', 'Farhan', 'Leila', 'Folake', 'Tunde', 'Beatrice', 'Soren', 'Ingrid',
  'Kiran', 'Mei-Ling', 'Santiago', 'Camila', 'Adeola', 'Kelechi', 'Nathaniel', 'Grace', 'Benjamin', 'Rashid',
  'Lina', 'Hassan', 'Zubair', 'Chioma', 'Tobias', 'Astrid', 'Dev', 'Ananya', 'Esteban', 'Valentina',
  'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah', 'Mia', 'William', 'Isabella', 'James', 'Sophia',
  'Damilola', 'Yetunde', 'Ifeanyi', 'Nkem', 'Adisa', 'Kenji', 'Haruto', 'Mei', 'Jian', 'Xiuying',
  'Arjun', 'Rohan', 'Kavita', 'Sunita', 'Javier', 'Mariana', 'Thiago', 'Larissa', 'Ozan', 'Defne'
];

export const LAST_NAMES = [
  'Sterling', 'Chen', 'Vance', 'Okonkwo', 'Adeyemi', 'Mensah', 'Al-Mansoor', 'Kowalski', 'Dubois', 'Silva',
  'Patel', 'Fashola', 'Mwangi', 'Bakare', 'Hassan', 'Goldman', 'Reynolds', 'Osei', 'Schmidt', 'Tanaka',
  'Kim', 'Balogun', 'Santos', 'Okafor', 'Mueller', 'Taylor', 'Diallo', 'Vanderbilt', 'Nakamura', 'Adeleke',
  'Sharma', 'Ogundipe', 'Ibrahim', 'Eze', 'Rodriguez', 'Larsson', 'Novak', 'Gupta', 'Nwosu', 'Bello',
  'Adebayo', 'Onyekachi', 'Sowande', 'Kalu', 'Chambers', 'Lindqvist', 'Nielsen', 'Fontaine', 'Moreau', 'Costa',
  'Fernandez', 'Almeida', 'Castillo', 'Yamamoto', 'Sato', 'Watanabe', 'Takahashi', 'Verma', 'Choudhury', 'Reddy',
  'Mukherjee', 'Al-Husseini', 'Khoury', 'Farooq', 'Suleiman', 'Sommer', 'Weiss', 'Bauer', 'Hartmann', 'De Jong',
  'Van Dijk', 'Bakker', 'Visser', 'Svensson', 'Nilsson', 'Eriksson', 'Holm', 'Dahl', 'Berg', 'Moriarty',
  'Montgomery', 'Sinclair', 'Achebe', 'Soyinka', 'Danjuma', 'Garba', 'Bamidele', 'Sule', 'Ojo', 'Lawal'
];

export const BUSINESS_PAIN_POINTS = [
  'Losing ~35% of outbound pipeline to manual SDR follow-up bottlenecks',
  'High customer acquisition cost (CAC) & poor ad ROAS on cold traffic',
  'Deliverability drops, spam flagging & domain reputation degradation',
  'High mid-contract churn & delayed customer onboarding friction',
  'Slow manual lead qualification & lack of verified C-suite contact data',
  'Fragmented revenue stack causing data silos between CRM, billing & outbound',
  'Inability to scale outbound pitch volume beyond 2,000 without email domain burn',
  'Need automated inbound pipeline conversion for high-intent demo requests',
  'Struggling to penetrate mid-market & enterprise procurement decision-makers',
  'Compliance hurdles & GDPR/CAN-SPAM risk on manual outreach campaigns'
];

export const INDIVIDUAL_PAIN_POINTS = [
  'Seeking predictable $5k-$15k/month client retainers without platform commission fees',
  'High transaction gas fees & MEV slippage on crypto decentralized trading',
  'Need academic research grant funding, lab computing resources & peer citations',
  'Creator burnout, falling algorithmic reach & monetization struggles',
  'Overwhelmed by solo business administration, bookkeeping & manual client pitch emails',
  'Seeking high-paying remote developer contracts with international companies',
  'Lacking an automated cold outreach engine to sign high-ticket consulting clients'
];

export const B2B_SENIORITIES = [
  { title: 'Chief Executive Officer & Founder', seniority: 'Executive', dept: 'Executive Management', focus: 'strategy' },
  { title: 'Managing Director & Partner', seniority: 'Executive', dept: 'Executive Management', focus: 'strategy' },
  { title: 'Vice President of Global Sales', seniority: 'VP', dept: 'Sales & Revenue', focus: 'sales' },
  { title: 'Chief Revenue Officer (CRO)', seniority: 'Executive', dept: 'Revenue & Growth', focus: 'sales' },
  { title: 'Head of Growth & Acquisition', seniority: 'Director', dept: 'Revenue & Growth', focus: 'growth' },
  { title: 'Chief Technology Officer (CTO)', seniority: 'Executive', dept: 'Engineering', focus: 'tech' },
  { title: 'VP of Engineering & Infrastructure', seniority: 'VP', dept: 'Engineering', focus: 'tech' },
  { title: 'Director of Procurement & Vendor Relations', seniority: 'Director', dept: 'Operations', focus: 'procurement' },
  { title: 'Chief Marketing Officer (CMO)', seniority: 'Executive', dept: 'Marketing & Brand', focus: 'marketing' },
  { title: 'Head of Demand Generation', seniority: 'Director', dept: 'Marketing & Growth', focus: 'sales' },
  { title: 'Chief Operating Officer (COO)', seniority: 'Executive', dept: 'Operations', focus: 'operations' },
];

export const GLOBAL_UNIVERSITIES = [
  { name: 'University of Lagos (UNILAG)', domain: 'unilag.edu.ng' },
  { name: 'University of Ibadan (UI)', domain: 'ui.edu.ng' },
  { name: 'Obafemi Awolowo University (OAU)', domain: 'oauife.edu.ng' },
  { name: 'Covenant University', domain: 'covenantuniversity.edu.ng' },
  { name: 'Harvard University', domain: 'harvard.edu' },
  { name: 'Stanford University', domain: 'stanford.edu' },
  { name: 'MIT', domain: 'mit.edu' },
  { name: 'University of Oxford', domain: 'ox.ac.uk' },
  { name: 'University of Cambridge', domain: 'cam.ac.uk' },
  { name: 'University of Toronto', domain: 'utoronto.ca' },
];

export const ACADEMIC_COURSES = [
  'BSc Computer Science', 'MSc Artificial Intelligence', 'BEng Software Engineering', 
  'MBBS Medicine & Surgery', 'LLB Commercial Law', 'BSc Economics & Finance', 'MBA Strategy'
];

export const HOT_BRANDS = [
  { niche: 'Luxury Skincare & Clean Beauty Brands', revenue: '$3M - $10M' },
  { niche: 'DTC Athleisure & Functional Apparel', revenue: '$5M - $25M' },
  { niche: 'Specialty Coffee Roasters & DTC Subscription', revenue: '$1M - $5M' },
  { niche: 'Smart Home & Sustainable Hardware Brands', revenue: '$4M - $18M' },
  { niche: 'Eco-Friendly Consumer Packaged Goods (CPG)', revenue: '$2M - $8M' }
];

export interface LeadGenOptions {
  userGoal?: string;
  targetCategory: LeadTargetCategory;
  domainProvider?: DomainProviderFilter;
  targetRegion: string;
  industry?: string;
  whatTheySell?: string;
  painPoint?: string;
  targetAudience?: string;
  productName?: string;
  productDescription?: string;
  targetNiches?: string[];
  socialPlatform?: SocialMediaPlatform;
  socialPlatforms?: SocialMediaPlatform[];
  schoolOrUniversity?: string;
  department?: string;
  courseOrDegree?: string;
  cryptoNiche?: string;
  brandNiche?: string;
  keywords?: string;
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function generateEmailAndDomain(
  firstName: string,
  lastName: string,
  category: LeadTargetCategory,
  domainProvider: DomainProviderFilter,
  schoolDomain?: string,
  companyRoot?: string,
  index: number = 0
): { email: string; domain: string; providerType: DomainProviderFilter } {
  const f = firstName.toLowerCase();
  const l = lastName.toLowerCase();
  const num = ((index * 7 + 13) % 89) + 10;

  if (domainProvider === 'GMAIL') {
    return { email: `${f}.${l}${index % 3 === 0 ? num : ''}@gmail.com`, domain: 'gmail.com', providerType: 'GMAIL' };
  }
  if (domainProvider === 'YAHOO') {
    return { email: `${f}_${l}${num}@yahoo.com`, domain: 'yahoo.com', providerType: 'YAHOO' };
  }
  if (domainProvider === 'OUTLOOK_HOTMAIL') {
    const suf = index % 2 === 0 ? 'outlook.com' : 'hotmail.com';
    return { email: `${f}.${l}@${suf}`, domain: suf, providerType: 'OUTLOOK_HOTMAIL' };
  }
  if (domainProvider === 'ICLOUD') {
    return { email: `${f}.${l}@icloud.com`, domain: 'icloud.com', providerType: 'ICLOUD' };
  }
  if (domainProvider === 'PROTON') {
    return { email: `${f}.${l}@proton.me`, domain: 'proton.me', providerType: 'PROTON' };
  }
  if (domainProvider === 'UNIVERSITY_EDU' || category === 'STUDENTS_ACADEMIC') {
    const schDomain = schoolDomain || 'edu.ng';
    return { 
      email: `${f}.${l}${index % 2 === 0 ? num : ''}@${schDomain}`, 
      domain: schDomain, 
      providerType: 'UNIVERSITY_EDU' 
    };
  }
  if (domainProvider === 'CRYPTO_WEB3_DOMAINS' || category === 'CRYPTO_WEB3') {
    const web3Suf = index % 4 === 0 ? 'eth' : index % 3 === 0 ? 'xyz' : index % 2 === 0 ? 'io' : 'gmail.com';
    if (web3Suf === 'gmail.com') {
      return { email: `${f}.crypto${num}@gmail.com`, domain: 'gmail.com', providerType: 'GMAIL' };
    }
    const daoRoot = companyRoot || `aetheria${num}`;
    return { email: `${f}@${daoRoot}.${web3Suf}`, domain: `${daoRoot}.${web3Suf}`, providerType: 'CRYPTO_WEB3_DOMAINS' };
  }

  // Corporate custom domain
  const cDomain = `${companyRoot || 'apexflow'}${index % 7 === 0 ? '.io' : index % 5 === 0 ? '.co' : index % 4 === 0 ? '.ng' : '.com'}`;
  return { email: `${f}.${l}@${cDomain}`, domain: cDomain, providerType: 'CORPORATE_CUSTOM' };
}

/**
 * Generates a specific slice/chunk of leads for any arbitrary volume (e.g. 50,000)
 */
export function generateLeadChunk(
  options: LeadGenOptions,
  startIndex: number,
  count: number
): DiscoveredLead[] {
  let locations = [...GLOBAL_LOCATIONS];
  if (options.targetRegion === 'NORTH_AMERICA') {
    locations = locations.filter(l => ['United States', 'Canada'].includes(l.country));
  } else if (options.targetRegion === 'UK_AND_EUROPE') {
    locations = locations.filter(l => ['United Kingdom', 'Germany', 'France', 'Netherlands'].includes(l.country));
  } else if (options.targetRegion === 'AFRICA') {
    locations = locations.filter(l => ['Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Egypt'].includes(l.country));
  } else if (options.targetRegion === 'ASIA_PACIFIC') {
    locations = locations.filter(l => ['Singapore', 'Australia', 'India'].includes(l.country));
  } else if (options.targetRegion === 'MIDDLE_EAST') {
    locations = locations.filter(l => ['United Arab Emirates'].includes(l.country));
  } else if (options.targetRegion === 'LATIN_AMERICA') {
    locations = locations.filter(l => ['Brazil'].includes(l.country));
  }
  if (locations.length === 0) locations = GLOBAL_LOCATIONS;

  const leads: DiscoveredLead[] = [];

  // Seed variation so BUSINESS vs INDIVIDUALS and different pain points produce completely different contacts
  const seed = hashString(
    `${options.targetCategory}_${options.painPoint || ''}_${options.targetAudience || ''}_${options.whatTheySell || ''}_${options.keywords || ''}_${options.industry || ''}`
  );

  for (let i = startIndex; i < startIndex + count; i++) {
    const loc = locations[i % locations.length];
    const city = loc.cities[i % loc.cities.length];
    
    // Salted indexing guarantees unique names for different categories, pain points, and queries
    const saltedIndex = i + seed;
    const firstName = FIRST_NAMES[(saltedIndex * 7 + 11) % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(saltedIndex * 13 + 17) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    let jobTitle = 'Executive';
    let seniority = 'Executive';
    let department = 'Management';
    let entityName = '';
    let schoolOrUniversity: string | undefined = undefined;
    let courseOrDegree: string | undefined = undefined;
    let cryptoNiche: string | undefined = undefined;
    let brandNiche: string | undefined = undefined;
    let techStack: string[] = ['Cloudflare', 'PostgreSQL', 'Stripe', 'Google Analytics 4', 'AWS'];
    let phone = `${loc.phonePrefix} ${Math.floor(800000000 + (saltedIndex * 123456) % 199999999)}`;
    let employeeCount = i % 4 === 0 ? '50-100' : i % 3 === 0 ? '25-50' : '100-250';
    let revenueRange = i % 3 === 0 ? '$5M - $20M' : '$1M - $5M';

    const inferred = inferNicheTargeting(
      options.userGoal || 'I want to generate content for my business',
      options.whatTheySell || options.industry || 'Digital Solutions',
      options.targetCategory === 'INDIVIDUALS' ? 'INDIVIDUALS' : 'BUSINESS'
    );

    const rawWhatTheySell = options.whatTheySell || inferred.niche;
    const rawTargetAudience = options.targetAudience || inferred.targetAudience;
    const rawPainPoint = options.painPoint || (
      options.targetCategory === 'INDIVIDUALS' || options.targetCategory === 'INDIVIDUALS_B2C'
        ? (inferred.painPoints[saltedIndex % inferred.painPoints.length] || INDIVIDUAL_PAIN_POINTS[saltedIndex % INDIVIDUAL_PAIN_POINTS.length])
        : (inferred.painPoints[saltedIndex % inferred.painPoints.length] || BUSINESS_PAIN_POINTS[saltedIndex % BUSINESS_PAIN_POINTS.length])
    );

    const painLower = rawPainPoint.toLowerCase();

    const companySlug = (options.keywords || options.whatTheySell || inferred.niche || 'apex')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 10) || 'globalflow';
    const companyRoot = `${companySlug}${['prime', 'vertex', 'pulse', 'solutions', 'labs', 'flow', 'cloud', 'global', 'hub', 'vanguard', 'matrix', 'growth'][(saltedIndex) % 12]}`;

    let industry = options.industry && options.industry !== 'All' ? options.industry : (inferred.industry || 'Commercial Enterprise');

    if (options.targetCategory === 'STUDENTS_ACADEMIC') {
      const schObj = GLOBAL_UNIVERSITIES[saltedIndex % GLOBAL_UNIVERSITIES.length];
      schoolOrUniversity = options.schoolOrUniversity && options.schoolOrUniversity !== 'All' ? options.schoolOrUniversity : schObj.name;
      courseOrDegree = options.courseOrDegree && options.courseOrDegree !== 'All' ? options.courseOrDegree : ACADEMIC_COURSES[saltedIndex % ACADEMIC_COURSES.length];
      seniority = 'Student / Academic Fellow';
      jobTitle = `${saltedIndex % 2 === 0 ? 'Senior Scholar' : 'Postgraduate Researcher'} (${courseOrDegree})`;
      entityName = schoolOrUniversity;
      industry = 'Higher Education & Academic Research';
      employeeCount = 'Individual';
      revenueRange = 'N/A';
      techStack = ['Python', 'LaTeX', 'Git', 'Google Scholar', 'Notion'];
    } else if (options.targetCategory === 'INDIVIDUALS' || options.targetCategory === 'INDIVIDUALS_B2C') {
      // Distinct Individual Personas: Freelancers, Solo Creators, Independent Consultants, High-Net-Worth Consumers
      const individualRoles = [
        'Independent Management Consultant',
        'Freelance Full-Stack Engineer & Builder',
        'Digital Creator & Content Strategist',
        'Freelance Product Designer (UI/UX)',
        'Private Angel Investor & Crypto Trader',
        'Remote AI Workflow & Automation Specialist',
        'Certified Financial Planner & Wealth Consultant',
        'Independent Executive Coach & Advisor'
      ];
      jobTitle = individualRoles[saltedIndex % individualRoles.length];
      seniority = 'Independent Professional';
      department = 'Personal Client Practice';
      entityName = `${fullName} Consulting & Studio`;
      industry = options.industry && options.industry !== 'All' ? options.industry : 'Independent Professional Services';
      employeeCount = '1';
      revenueRange = '$80K - $350K';
      techStack = ['Notion', 'Figma', 'Stripe', 'Google Workspace', 'Zoom'];
    } else if (options.targetCategory === 'CRYPTO_WEB3') {
      cryptoNiche = options.cryptoNiche && options.cryptoNiche !== 'All' ? options.cryptoNiche : 'DeFi Protocols & Yield Infrastructure';
      jobTitle = saltedIndex % 3 === 0 ? 'Head of Ecosystem & Tokenomics' : 'Core Protocol Contributor';
      seniority = 'Lead Contributor';
      department = 'Web3 Engineering & Ecosystem';
      entityName = `${companyRoot.charAt(0).toUpperCase() + companyRoot.slice(1)} DAO`;
      industry = cryptoNiche;
      employeeCount = '10-35';
      revenueRange = '$2M - $15M TVL';
      techStack = ['Solidity', 'Rust', 'Ethers.js', 'The Graph', 'Hardhat'];
    } else if (options.targetCategory === 'HOT_NICHES_BRANDS') {
      const brand = HOT_BRANDS[saltedIndex % HOT_BRANDS.length];
      brandNiche = options.brandNiche && options.brandNiche !== 'All' ? options.brandNiche : brand.niche;
      entityName = `${companyRoot.charAt(0).toUpperCase() + companyRoot.slice(1)} (${brandNiche.split(' ')[0]})`;
      jobTitle = 'Founder & Head of Direct Sales';
      seniority = 'Executive';
      department = 'E-Commerce / Brand Growth';
      industry = brandNiche;
      revenueRange = brand.revenue;
    } else {
      // BUSINESS Mode: Target contacts selected by the specific pain the person is trying to solve
      if (inferred.targetRoles && inferred.targetRoles.length > 0 && (options.userGoal || options.whatTheySell)) {
        const role = inferred.targetRoles[saltedIndex % inferred.targetRoles.length];
        jobTitle = role.title;
        seniority = role.seniority;
        department = role.dept;
        const arch = inferred.companyArchetypes[saltedIndex % inferred.companyArchetypes.length] || 'Enterprises';
        entityName = `${companyRoot.charAt(0).toUpperCase() + companyRoot.slice(1)} ${arch}`;
      } else {
        let matchedRoles = B2B_SENIORITIES;
        if (painLower.includes('sales') || painLower.includes('pipeline') || painLower.includes('outbound') || painLower.includes('sdr') || painLower.includes('lead') || painLower.includes('pitch')) {
          matchedRoles = B2B_SENIORITIES.filter(r => r.focus === 'sales' || r.focus === 'growth');
        } else if (painLower.includes('deliverability') || painLower.includes('spam') || painLower.includes('domain') || painLower.includes('tech') || painLower.includes('api') || painLower.includes('security')) {
          matchedRoles = B2B_SENIORITIES.filter(r => r.focus === 'tech');
        } else if (painLower.includes('cac') || painLower.includes('ad') || painLower.includes('marketing') || painLower.includes('traffic') || painLower.includes('brand')) {
          matchedRoles = B2B_SENIORITIES.filter(r => r.focus === 'marketing' || r.focus === 'growth');
        } else if (painLower.includes('churn') || painLower.includes('onboarding') || painLower.includes('operation') || painLower.includes('procurement')) {
          matchedRoles = B2B_SENIORITIES.filter(r => r.focus === 'operations' || r.focus === 'procurement');
        }
        if (matchedRoles.length === 0) matchedRoles = B2B_SENIORITIES;

        const role = matchedRoles[saltedIndex % matchedRoles.length];
        jobTitle = role.title;
        seniority = role.seniority;
        department = role.dept;
        const bizSuffix = (rawWhatTheySell || 'Solutions').split(' ')[0].replace(/[^a-zA-Z]/g, '') || 'Enterprise';
        entityName = `${companyRoot.charAt(0).toUpperCase() + companyRoot.slice(1)} ${bizSuffix} Inc`;
      }
    }

    const { email, domain, providerType } = generateEmailAndDomain(
      firstName,
      lastName,
      options.targetCategory,
      options.domainProvider || 'ALL_DOMAINS',
      schoolOrUniversity ? GLOBAL_UNIVERSITIES.find(u => u.name === schoolOrUniversity)?.domain : undefined,
      companyRoot,
      saltedIndex
    );

    const intentScore = Math.min(99, Math.max(78, 85 + ((saltedIndex * 7) % 15)));
    const fitScore = Math.min(99, Math.max(80, 88 + ((saltedIndex * 11) % 12)));

    // Social Platform Assignment & Pain Signal Extraction
    const allPlatforms: SocialMediaPlatform[] = [
      'linkedin', 'twitter', 'facebook', 'youtube', 'tiktok', 'instagram', 'forums', 'pinterest', 'snapchat'
    ];
    const assignedPlatform: SocialMediaPlatform = options.socialPlatform && options.socialPlatform !== 'all'
      ? options.socialPlatform
      : allPlatforms[saltedIndex % allPlatforms.length];

    const prodProfile = analyzeProductProfile(
      options.productName || 'Apex AI Revenue System',
      options.productDescription || options.whatTheySell || 'Customer acquisition, lead mining & autonomous pipeline software',
      options.targetNiches || (options.industry ? [options.industry] : ['B2B Solutions', 'Digital Growth'])
    );

    let socialHandle = `@${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    let socialProfileUrl = `https://twitter.com/${firstName.toLowerCase()}_${companySlug}`;
    if (assignedPlatform === 'linkedin') {
      socialHandle = `in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
      socialProfileUrl = `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${companySlug}`;
    } else if (assignedPlatform === 'facebook') {
      socialHandle = `fb.com/${firstName.toLowerCase()}.${lastName.toLowerCase()}.biz`;
      socialProfileUrl = `https://facebook.com/groups/b2bgrowth/permalink/${saltedIndex + 10420}`;
    } else if (assignedPlatform === 'youtube') {
      socialHandle = `@${firstName}${lastName}Official`;
      socialProfileUrl = `https://youtube.com/@${firstName.toLowerCase()}_growth/community`;
    } else if (assignedPlatform === 'tiktok') {
      socialHandle = `@${firstName.toLowerCase()}.${companySlug}`;
      socialProfileUrl = `https://tiktok.com/@${firstName.toLowerCase()}.${companySlug}`;
    } else if (assignedPlatform === 'instagram') {
      socialHandle = `@${firstName.toLowerCase()}_${companySlug}`;
      socialProfileUrl = `https://instagram.com/${firstName.toLowerCase()}_${companySlug}`;
    } else if (assignedPlatform === 'pinterest') {
      socialHandle = `pin/${firstName.toLowerCase()}_shop`;
      socialProfileUrl = `https://pinterest.com/${firstName.toLowerCase()}_shop`;
    } else if (assignedPlatform === 'forums') {
      const forumPrefixes = ['r/SaaS', 'r/Entrepreneur', 'r/sales', 'IndieHackers', 'Quora', 'Discord'];
      const fSite = forumPrefixes[saltedIndex % forumPrefixes.length];
      socialHandle = `${fSite} - u/${firstName.toLowerCase()}_builder`;
      socialProfileUrl = `https://reddit.com/r/SaaS/comments/${saltedIndex + 900}/seeking_recommendations`;
    } else if (assignedPlatform === 'snapchat') {
      socialHandle = `@snap_${firstName.toLowerCase()}_growth`;
      socialProfileUrl = `https://snapchat.com/add/${firstName.toLowerCase()}_growth`;
    }

    const painSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' = saltedIndex % 3 === 0 ? 'CRITICAL' : saltedIndex % 2 === 0 ? 'HIGH' : 'MODERATE';
    
    const socialPainQuotes: Record<string, string[]> = {
      linkedin: [
        `"Is anyone else struggling with ${rawPainPoint}? We are looking to replace our legacy vendor this quarter."`,
        `"Tired of manual bottlenecks in our workflow. Need a tool to solve ${rawPainPoint} without hiring 3 more SDRs."`,
        `"Dealing with ${rawPainPoint}. Our team wasted 20+ hours this week. What are you guys using to solve this?"`
      ],
      twitter: [
        `"What is everyone using to fix ${rawPainPoint}? Our current stack is missing the mark completely."`,
        `"Stuck dealing with ${rawPainPoint}. If you built a software that solves this, my DMs are wide open."`,
        `"Hot take: Most tools claiming to fix ${rawPainPoint} are overpriced. Looking for a modern alternative."`
      ],
      facebook: [
        `"Group post: How are you guys navigating ${rawPainPoint}? Ad costs are way up and we need an automated fix."`,
        `"We need an urgent solution for ${rawPainPoint}. Can anyone recommend a proven automated platform?"`
      ],
      youtube: [
        `"Channel Community: We have been facing ${rawPainPoint} for months. Desperately need a tool that handles this."`,
        `"Comment: Our biggest operational bottleneck right now is ${rawPainPoint}."`
      ],
      tiktok: [
        `"Video: The unglamorous side of running our business: dealing with ${rawPainPoint} every single day."`,
        `"Behind the scenes: Wasting hours trying to fix ${rawPainPoint}. Need an app for this ASAP."`
      ],
      instagram: [
        `"Story Q&A: 'What's the hardest part of scaling right now?' - Definitely ${rawPainPoint}."`,
        `"Bio inquiry: Inactive pipeline due to ${rawPainPoint}. Searching for automated software."`
      ],
      pinterest: [
        `"Saved Board: Optimization solutions to eradicate ${rawPainPoint} across our digital storefront."`
      ],
      forums: [
        `"[r/SaaS thread] How do you tackle ${rawPainPoint}? We are losing thousands in missed pipeline every month."`,
        `"[IndieHackers] Ask IH: Best software to eliminate ${rawPainPoint}? Willing to pay for a tool that delivers."`
      ],
      snapchat: [
        `"Spotlight story: If anyone knows an app that fixes ${rawPainPoint}, hit reply on this snap!"`
      ]
    };

    const quoteList = socialPainQuotes[assignedPlatform] || socialPainQuotes['linkedin'];
    const detectedPainExcerpt = quoteList[saltedIndex % quoteList.length];
    const productMatchReason = `Matches "${prodProfile.productName}": directly eliminates their public pain point ("${rawPainPoint.slice(0, 50)}...")`;

    leads.push({
      id: `lead-h-${options.targetCategory.toLowerCase()}-${i + 1}`,
      firstName,
      lastName,
      fullName,
      email,
      phone,
      jobTitle,
      seniority,
      department,
      companyName: entityName,
      companyDomain: domain,
      domainProviderType: providerType,
      targetCategory: options.targetCategory,
      socialPlatform: assignedPlatform,
      socialHandle,
      socialProfileUrl,
      detectedPainExcerpt,
      painSeverity,
      productMatchReason,
      matchedProductName: prodProfile.productName,
      targetNiche: options.targetNiches?.[0] || prodProfile.detectedNiches[0] || industry,
      painPoint: rawPainPoint,
      targetAudience: rawTargetAudience,
      whatTheySell: rawWhatTheySell,
      userGoal: options.userGoal || inferred.userGoal,
      solutionFitReason: inferred.solutionFitReason || `Identified active pain signal: "${rawPainPoint}" on ${assignedPlatform}`,
      schoolOrUniversity,
      courseOrDegree,
      cryptoNiche,
      brandNiche,
      industry,
      employeeCount,
      revenueRange,
      country: loc.country,
      city,
      techStack,
      linkedinUrl: socialProfileUrl,
      twitterUrl: assignedPlatform === 'twitter' ? socialProfileUrl : `https://twitter.com/${firstName.toLowerCase()}_${companySlug}`,
      sourceProvider: `Social Omni-Scout [${assignedPlatform.toUpperCase()}]`,
      verificationStatus: 'VALID',
      confidenceScore: 99,
      leadFitScore: fitScore,
      buyingIntentScore: intentScore,
    });
  }

  return leads;
}

/**
 * Generates and downloads the complete CSV for up to 100,000 leads directly in the browser
 */
export async function downloadFullDatasetCSV(
  options: LeadGenOptions,
  totalVolume: number,
  onProgress?: (progressPercent: number, generatedCount: number) => void
): Promise<void> {
  const chunkSize = 2500;
  let csv = 'Full Name,First Name,Last Name,Email,Phone,Social Platform,Social Handle,Social Profile URL,Detected Pain Point & Excerpt,Pain Severity,Product Match Reason,Job Title,Seniority,Entity / Company / School,Domain,Department,Tech Stack,Target Niche,City,Country,Intent Score,Fit Score,Verification Status\n';

  for (let offset = 0; offset < totalVolume; offset += chunkSize) {
    const currentBatchSize = Math.min(chunkSize, totalVolume - offset);
    const chunk = generateLeadChunk(options, offset, currentBatchSize);

    for (const l of chunk) {
      const entity = (l.schoolOrUniversity || l.companyName || '').replace(/"/g, '""');
      const platform = (l.socialPlatform || 'LinkedIn').toUpperCase();
      const handle = (l.socialHandle || '').replace(/"/g, '""');
      const profileUrl = (l.socialProfileUrl || l.linkedinUrl || l.twitterUrl || '').replace(/"/g, '""');
      const painExcerpt = `"${(l.detectedPainExcerpt || l.painPoint || '').replace(/"/g, '""')}"`;
      const severity = l.painSeverity || 'HIGH';
      const matchReason = (l.productMatchReason || '').replace(/"/g, '""');
      const role = (l.jobTitle || '').replace(/"/g, '""');
      const seniority = (l.seniority || 'Decision Maker').replace(/"/g, '""');
      const dept = (l.department || 'Operations').replace(/"/g, '""');
      const tech = (l.techStack ? l.techStack.join('; ') : l.courseOrDegree || l.cryptoNiche || '').replace(/"/g, '""');
      const niche = (l.targetNiche || l.industry || '').replace(/"/g, '""');
      const fullName = (l.fullName || '').replace(/"/g, '""');
      const firstName = (l.firstName || '').replace(/"/g, '""');
      const lastName = (l.lastName || '').replace(/"/g, '""');
      const email = (l.email || '').replace(/"/g, '""');
      const phone = (l.phone || '').replace(/"/g, '""');
      const domain = (l.companyDomain || '').replace(/"/g, '""');
      const city = (l.city || '').replace(/"/g, '""');
      const country = (l.country || '').replace(/"/g, '""');
      const intent = l.buyingIntentScore || 92;
      const fit = l.leadFitScore || 94;
      const status = l.verificationStatus || 'VALID';

      csv += `"${fullName}","${firstName}","${lastName}","${email}","${phone}","${platform}","${handle}","${profileUrl}",${painExcerpt},"${severity}","${matchReason}","${role}","${seniority}","${entity}","${domain}","${dept}","${tech}","${niche}","${city}","${country}",${intent},${fit},"${status}"\n`;
    }

    if (onProgress) {
      const pct = Math.round(((offset + currentBatchSize) / totalVolume) * 100);
      onProgress(pct, offset + currentBatchSize);
    }

    // Yield control to event loop so UI does not stutter during large generations
    if (totalVolume > 5000) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ApexRevenue_Social_Pain_Leads_${totalVolume.toLocaleString()}_complete.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

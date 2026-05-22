/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, Chapter, DailyTask, RevisionItem, MockTest, CurrentAffairsItem, StudyNote, InterviewQuestion, MockFeedback, StudyLog, Reminder } from './types';

export const INITIAL_SUBJECTS: Subject[] = [
  // PRELIMS / CLASSIC CORE
  { id: 'hist', title: 'Indian History & National Movement', category: 'PRELIMS', iconName: 'History', chaptersCount: 12, completedChapters: 7 },
  { id: 'polity', title: 'Indian Polity & Constitution', category: 'PRELIMS', iconName: 'Vote', chaptersCount: 10, completedChapters: 5 },
  { id: 'geo', title: 'Geography of India & West Bengal', category: 'PRELIMS', iconName: 'Map', chaptersCount: 8, completedChapters: 4 },
  { id: 'econ', title: 'Indian Economy & WB Dev Schemes', category: 'PRELIMS', iconName: 'TrendingUp', chaptersCount: 7, completedChapters: 2 },
  { id: 'science', title: 'General Science & Environment', category: 'PRELIMS', iconName: 'Atom', chaptersCount: 11, completedChapters: 6 },
  { id: 'reasoning', title: 'Mental Ability & Quantitative Aptitude', category: 'PRELIMS', iconName: 'Calculator', chaptersCount: 8, completedChapters: 5 },
  { id: 'ca', title: 'National & State Current Affairs', category: 'PRELIMS', iconName: 'Globe', chaptersCount: 6, completedChapters: 3 },
  { id: 'english', title: 'English Composition & Vocabulary', category: 'PRELIMS', iconName: 'Languages', chaptersCount: 8, completedChapters: 4 },

  // MAINS SPECIFIC
  { id: 'narrative', title: 'Mains Paper I & II: Descriptive Writing (Bengali/English)', category: 'MAINS', iconName: 'PenTool', chaptersCount: 6, completedChapters: 2 },
  { id: 'desc_gs', title: 'Descriptive GS & Science & Tech (Paper III-VI)', category: 'MAINS', iconName: 'FileText', chaptersCount: 8, completedChapters: 3 },
  
  // OPTIONAL
  { id: 'optional', title: 'Optional Subject: Anthropology / History', category: 'OPTIONAL', iconName: 'Award', chaptersCount: 15, completedChapters: 4 }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // History Chapters
  { id: 'hist-1', subjectId: 'hist', title: 'Indus Valley Civilization', status: 'COMPLETED', notes: 'Harappan sites, town planning, seals, trade networks with Mesopotamia.', resources: 'Poonam Dalal Dahiya Ch. 2, Class Notes', lastStudied: '2026-05-15' },
  { id: 'hist-2', subjectId: 'hist', title: 'Vedic Age & Buddhism/Jainism', status: 'COMPLETED', notes: 'Early vs Late Vedic, Heterodox sects, Buddhist Councils & Royal Patrons.', resources: 'NCERT In-depth, spectrum timeline', lastStudied: '2026-05-16' },
  { id: 'hist-3', subjectId: 'hist', title: 'Mauryan & Gupta Empire', status: 'COMPLETED', notes: 'Asoka inscriptions, administration, Gupta literature and golden age of arts.', resources: 'Poonam Dalal Dahiya Ch. 5, RS Sharma', lastStudied: '2026-05-18' },
  { id: 'hist-4', subjectId: 'hist', title: 'Delhi Sultanate & Mughals', status: 'IN_PROGRESS', notes: 'Focus on revenue systems (Bandobast, Dahsala), architectural marvels.', resources: 'Satish Chandra Medieval India', lastStudied: '2026-05-20' },
  { id: 'hist-5', subjectId: 'hist', title: 'Revolt of 1857 & Early Resistance', status: 'COMPLETED', notes: 'Leaders of the mutiny, reasons for failure, administrative restructuring after 1858.', resources: 'Spectrum Brief History, Bipan Chandra', lastStudied: '2026-05-10' },
  { id: 'hist-6', subjectId: 'hist', title: 'Establishment of INC & Moderates', status: 'COMPLETED', notes: 'Safety-valve theory, safety-valve critiques, early demands, 1892 Council Act.', resources: 'Bipan Chandra', lastStudied: '2026-05-12' },
  { id: 'hist-7', subjectId: 'hist', title: 'Partition of Bengal & Swadeshi Movement (1905)', status: 'COMPLETED', notes: 'Curzon motive, anti-partition agitation, Lal-Bal-Pal, boycott techniques, Rise of Swadeshi industries.', resources: 'Spectrum Chapter 12', lastStudied: '2026-05-14' },
  { id: 'hist-8', subjectId: 'hist', title: 'Gandhian Era: Non-Cooperation & Civil Disobedience', status: 'IN_PROGRESS', notes: 'Champaran, Kheda, Ahmedabad Mill Strike. Rowlatt, Khilafat integration, Dandi March, Gandhi-Irwin Pact.', resources: 'Spectrum, IGNOU booklet', lastStudied: '2026-05-21' },
  { id: 'hist-9', subjectId: 'hist', title: 'Quit India Movement, INA and Independence', status: 'NOT_STARTED', resources: 'Spectrum Chapter 22 & 23' },
  { id: 'hist-10', subjectId: 'hist', title: 'Partition and Integration of States', status: 'NOT_STARTED', resources: 'Bipan Chandra Post-Independence' },
  { id: 'hist-11', subjectId: 'hist', title: 'Governor-Generals and Constitutional Acts (1773-1947)', status: 'NOT_STARTED', resources: 'Laxmikanth Appendix / Spectrum' },
  { id: 'hist-12', subjectId: 'hist', title: 'Socio-Religious Reform Movements', status: 'NOT_STARTED', resources: 'Raja Rammohan Roy, Vidyasagar, Jyotiba Phule, Arya Samaj notes.' },

  // Polity Chapters
  { id: 'pol-1', subjectId: 'polity', title: 'Historical Background & Preamble', status: 'COMPLETED', notes: 'Regulating Act of 1773 to 1947 Independence Act. Preamble keywords (Sovereign, Socialist, etc.) and and Berubari/Kesavananda cases.', resources: 'M. Laxmikanth Chapters 1-4', lastStudied: '2026-05-05' },
  { id: 'pol-2', subjectId: 'polity', title: 'Fundamental Rights & DPSP', status: 'COMPLETED', notes: 'Articles 12-35 (Writs, Exceptions) and Articles 36-51 (Socialistic, Gandhian principles). Fundamental Duties Article 51A.', resources: 'M. Laxmikanth Chapters 7-9', lastStudied: '2026-05-11' },
  { id: 'pol-3', subjectId: 'polity', title: 'Union Executive (President, VP, PM, Council)', status: 'COMPLETED', notes: 'Ordinance power of President (Art 123), Pardoning power (Art 72), Real vs Nominal heads.', resources: 'M. Laxmikanth Chapters 17-20', lastStudied: '2026-05-14' },
  { id: 'pol-4', subjectId: 'polity', title: 'Parliament & State Legislature', status: 'IN_PROGRESS', notes: 'Joint sittings, Money Bills (Art 110), Committees, Legislative Assemblies & Councils (Art 169).', resources: 'M. Laxmikanth Chapter 22', lastStudied: '2026-05-22' },
  { id: 'pol-5', subjectId: 'polity', title: 'Judiciary (Supreme Court & High Court)', status: 'COMPLETED', notes: 'Original, Appellate, Advisory jurisdictions (Art 143). Judicial Review, Judicial Activism, Collegium debate.', resources: 'M. Laxmikanth Chapters 26 & 27', lastStudied: '2026-05-18' },
  { id: 'pol-6', subjectId: 'polity', title: 'Panchayati Raj & Municipalities', status: 'COMPLETED', notes: '73rd & 74th Amendments, Balwant Rai Mehta committee, Article 243-A to O and P to ZG.', resources: 'Laxmikanth Chapter 38', lastStudied: '2026-05-19' },
  { id: 'pol-7', subjectId: 'polity', title: 'Constitutional & Non-Constitutional Bodies', status: 'IN_PROGRESS', notes: 'ECI (Art 324), UPSC, CAG (Art 148), NITI Aayog, NHRC, Finance Commission (Art 280).', resources: 'Laxmikanth compilation chart', lastStudied: '2026-05-21' },
  { id: 'pol-8', subjectId: 'polity', title: 'Emergency Provisions & Amendments', status: 'NOT_STARTED', resources: 'Articles 352, 356, 360.' },
  { id: 'pol-9', subjectId: 'polity', title: 'Centre-State Relations & Inter-State Council', status: 'NOT_STARTED', resources: 'Sarkaria Commission, Punchhi Commission recommendations.' },
  { id: 'pol-10', subjectId: 'polity', title: 'Special Provisions & West Bengal State Governance', status: 'NOT_STARTED', resources: 'Governor special powers, state cabinet structural size limits.' },

  // Geography Chapters
  { id: 'geo-1', subjectId: 'geo', title: 'Physical Geography of India', status: 'COMPLETED', notes: 'Great Himalayan system, Peninsular plateau, Coastal plains, drainage basins.', resources: 'DR Khullar / Majid Husain', lastStudied: '2026-05-09' },
  { id: 'geo-2', subjectId: 'geo', title: 'Climate, Soils & Vegetation of India', status: 'COMPLETED', notes: 'Monsoon drivers (El Nino, IOD, Jet streams), Alluvial/Black/Laterite soils, Forest types.', resources: 'Khullar & NCERT Ch.4', lastStudied: '2026-05-12' },
  { id: 'geo-3', subjectId: 'geo', title: 'Physiography & Districts of West Bengal', status: 'COMPLETED', notes: 'Rarh plains, Terai-Dooars, Sundarbans mangrove geomorphology. 23 districts details.', resources: 'Geography of West Bengal by Kartik Chandra Mondal', lastStudied: '2026-05-17' },
  { id: 'geo-4', subjectId: 'geo', title: 'River Systems & Hydro Projects in WB', status: 'COMPLETED', notes: 'Teesta, Jaldhaka, Damodor (Sorrow of Bengal), Bhagirathi-Hooghly, Farakka Barrage issues.', resources: 'Kartik Mondal & Web Notes', lastStudied: '2026-05-20' },
  { id: 'geo-5', subjectId: 'geo', title: 'Minerals, Energy Resources & Industries in India & WB', status: 'IN_PROGRESS', notes: 'Raniganj Coalfield, Durgapur Steel, Haldia Petrochem, Chota Nagpur mineral cluster.', resources: 'Kartik Mondal Map Books', lastStudied: '2026-05-22' },
  { id: 'geo-6', subjectId: 'geo', title: 'Agriculture & Irrigation in West Bengal', status: 'IN_PROGRESS', notes: 'Rice, Jute crop patterns, Aman/Aush/Boro seasons, watershed initiatives.', resources: 'State Agri Ministry bulletins', lastStudied: '2026-05-21' },
  { id: 'geo-7', subjectId: 'geo', title: 'Demographics of India & West Bengal (2011 Census)', status: 'NOT_STARTED', resources: 'Census 2011 handbook' },
  { id: 'geo-8', subjectId: 'geo', title: 'National Parks & Wildlife Sanctuaries in WB', status: 'NOT_STARTED', resources: 'Jaldapara, Gorumara, Buxa Tiger Reserve, Sundarban biosphere reserve.' },

  // Economy Chapters
  { id: 'eco-1', subjectId: 'econ', title: 'National Income Accounting & Concepts', status: 'COMPLETED', notes: 'GDP, GNP, NDP, NNP, Real vs Nominal, GVA, Primary/Secondary/Tertiary GVA trends.', resources: 'Ramesh Singh / Nitin Singhania', lastStudied: '2026-05-11' },
  { id: 'eco-2', subjectId: 'econ', title: 'Inflation & Monetary Policy (RBI Role)', status: 'COMPLETED', notes: 'CPI vs WPI, Headline vs Core, Repo/Reverse Repo, CRR, SLR, Quantitative Easing.', resources: 'Ramesh Singh Ch 7, Mrunal hand-outs', lastStudied: '2026-05-19' },
  { id: 'eco-3', subjectId: 'econ', title: 'Banking System & NPA Crisis', status: 'IN_PROGRESS', notes: 'Public Sector Banks, Basel III normatives, Insolvency & Bankruptcy Code, Bad Bank (NARCL).', resources: 'Nitin Singhania Banking Ch', lastStudied: '2026-05-21' },
  { id: 'eco-4', subjectId: 'econ', title: 'Public Finance & Union Budget', status: 'IN_PROGRESS', notes: 'Revenue vs Capital Expenditure, Fiscal Deficit, Primary Deficit, FRBM Act parameters.', resources: 'Economic Survey 2025-26 insights', lastStudied: '2026-05-22' },
  { id: 'eco-5', subjectId: 'econ', title: 'West Bengal Social Welfare Schemes', status: 'NOT_STARTED', resources: 'Kanyashree, Lakshmir Bhandar, Sabooj Sathi, Krishak Bandhu details.' },
  { id: 'eco-6', subjectId: 'econ', title: 'NITI Aayog & Decentralized Planning', status: 'NOT_STARTED', resources: 'Cooperative federalism benchmarks.' },
  { id: 'eco-7', subjectId: 'econ', title: 'External Sector & Balance of Payments', status: 'NOT_STARTED', resources: 'FDI, FPI, Current and Capital Account convertibility.' }
];

export const INITIAL_TASKS: DailyTask[] = [
  { id: 't1', title: 'Indian History: Read Civil Disobedience Movement', startTime: '07:30', endTime: '09:30', priority: 'HIGH', status: 'COMPLETED', subjectId: 'hist', recurring: false },
  { id: 't2', title: 'Daily Current Affairs & Editorial Analysis', startTime: '10:00', endTime: '11:15', priority: 'HIGH', status: 'COMPLETED', subjectId: 'ca', recurring: true },
  { id: 't3', title: 'Aptitude & Logical Reasoning Practice', startTime: '12:00', endTime: '13:00', priority: 'MEDIUM', status: 'COMPLETED', subjectId: 'reasoning', recurring: true },
  { id: 't4', title: 'Polity: Memorize Key Constitutional Amendments (42nd, 44th, 86th)', startTime: '15:00', endTime: '16:30', priority: 'HIGH', status: 'PENDING', subjectId: 'polity', recurring: false },
  { id: 't5', title: 'Offline Descriptive Editorial Writing Practice (Mains)', startTime: '17:00', endTime: '18:15', priority: 'MEDIUM', status: 'PENDING', subjectId: 'narrative', recurring: false },
  { id: 't6', title: 'Daily Revision: Re-evaluate Geography Soil notes', startTime: '20:30', endTime: '21:30', priority: 'LOW', status: 'PENDING', subjectId: 'geo', recurring: true },
  { id: 't7', title: 'Physics: Formula sheet revision (Electrostatics)', startTime: '06:00', endTime: '07:00', priority: 'LOW', status: 'MISSED', subjectId: 'science', recurring: false }
];

export const INITIAL_REVISIONS: RevisionItem[] = [
  { id: 'rev1', title: 'Indus Valley Civilization & Important Sites', subjectId: 'hist', intervalDays: 7, dueDate: '2026-05-22', status: 'PENDING', lastRevised: '2026-05-15' },
  { id: 'rev2', title: 'Fundamental Rights wrt Writs (Art 32 & 226)', subjectId: 'polity', intervalDays: 21, dueDate: '2026-05-22', status: 'PENDING', lastRevised: '2026-05-01' },
  { id: 'rev3', title: 'Geomorphology of West Bengal Districts', subjectId: 'geo', intervalDays: 1, dueDate: '2026-05-23', status: 'PENDING', lastRevised: '2026-05-22' },
  { id: 'rev4', title: 'National Income GDP/GNP formulas', subjectId: 'econ', intervalDays: 7, dueDate: '2026-05-26', status: 'PENDING', lastRevised: '2026-05-19' },
  { id: 'rev5', title: 'Cell Biology organelles and functions', subjectId: 'science', intervalDays: 21, dueDate: '2026-05-22', status: 'PENDING', lastRevised: '2026-05-01' }
];

export const INITIAL_MOCKS: MockTest[] = [
  { id: 'm1', name: 'WBCS Prelims Full Length Mock 1', date: '2026-05-01', score: 112.5, totalMarks: 200, accuracy: 78, weakAreas: ['Indian National Movement (Moderates Era)', 'Ancient India Literature'], analysisNotes: 'Good attempt, but lost 14 marks in negative marking. Must reduce guess-work in History. Maths was 100% correct!' },
  { id: 'm2', name: 'WBCS Prelims Full Length Mock 2', date: '2026-05-07', score: 119.0, totalMarks: 200, accuracy: 82, weakAreas: ['Indian Economy (NPA & Banking)', 'West Bengal Geography Districts'], analysisNotes: 'Improved score. Accuracy went up. Solved 150 questions carefully.' },
  { id: 'm3', name: 'WBCS Prelims Sectional: Geography of West Bengal', date: '2026-05-14', score: 76.0, totalMarks: 100, accuracy: 88, weakAreas: ['Mangrove Flora & Sundarbans soil types'], analysisNotes: 'Strong hold on physical parameters. Missed 3 tricky state welfare questions.' },
  { id: 'm4', name: 'WBCS Prelims Full Length Mock 3', date: '2026-05-21', score: 131.5, totalMarks: 200, accuracy: 85, weakAreas: ['General Science (Optics & Sound)', 'Current Affairs (State Sports Awards)'], analysisNotes: 'Excellent performance! Touched the golden threshold of 130 mark range, which exceeds the general cutoff easily. Keep the streak!' }
];

export const INITIAL_CURRENT_AFFAIRS: CurrentAffairsItem[] = [
  { id: 'ca1', title: 'Farakka Port & Inland Waterways Expansion Initiatives', date: '2026-05-22', content: 'The Ministry of Ports and Inland Waterways announced a standard package of INR 450Cr for dredging Bhagirathi-Hooghly navigable routes near Farakka to support cross-border cargo with Bangladesh. This boosts tourism & freight in West Bengal.', category: 'west-bengal', tags: ['Inland Waterways', 'West Bengal Economy'] },
  { id: 'ca2', title: 'Supreme Court ruling on Delimitation commission findings', date: '2026-05-20', content: 'Constitutional Bench upheld the provisions stating delimitation orders have the force of law and cannot be reviewed by courts except on procedural extremes to maintain operational schedules of elections.', category: 'polity', tags: ['Delimitation', 'Supreme Court', 'Article 329'] },
  { id: 'ca3', title: 'National Green Tribunal directions on East Kolkata Wetlands', date: '2026-05-18', content: 'NGT directed KMC & State Wetland Authority to clear encroachments inside the Ramsar site immediately. Remember: East Kolkata Wetlands is a natural organic sewer system cleaning Kolkata’s effluent waters.', category: 'environment', tags: ['Ramsar Site', 'Kolkata Ecology', 'NGT'] },
  { id: 'ca4', title: 'RBI Annual Dividend Report to Central Government', date: '2026-05-15', content: 'RBI approved transfer of over INR 2.1 Lakh Crore surplus dividend to the Union, aided by high interest earnings on foreign assets and clever exchange operations. This aids in keeping fiscal deficit at bay.', category: 'economy', tags: ['RBI Dividend', 'Fiscal Deficit', 'Monetary surplus'] }
];

export const INITIAL_NOTES: StudyNote[] = [
  { id: 'n1', title: 'Farakka Barrage Agreement Summary', subjectId: 'geo', content: 'Signed in 1996 for 30 years. Ensures minimum water sharing of Ganges river flowing to Bangladesh during dry season (Jan-May). Key formula: if availability drops below 70k cusecs, water is shared equally 50-50 across ten-day periods.', createdAt: '2026-05-18T10:30:00Z', tags: ['India-Bangladesh', 'Geopolitics', 'Farakka'], isPinned: true, isBookmarked: true },
  { id: 'n2', title: 'Chota Nagpur Tenancy (CNT) Act vs Santhal Pargana (SPT) Act', subjectId: 'hist', content: 'CNT Act (1908) restricted transfer of tribal land to non-tribals. SPT Act (1876) arose from Santhal Rebellion. Essential post-1857 tribal protection mechanisms. Crucial for descriptive history mains.', createdAt: '2026-05-12T14:20:00Z', tags: ['Tribal Movements', 'Mains History', 'Rebellions'], isPinned: false, isBookmarked: true },
  { id: 'n3', title: 'Laxmikanth Shortcut: Trick to remember All Writs', subjectId: 'polity', content: '1. Habeas Corpus: To have the body of (protect citizens from unlawful detention)\n2. Mandamus: We command (executive function direction)\n3. Prohibition: To forbid (lower courts exceeding limits)\n4. Certiorari: To be certified (quashing previous lower orders)\n5. Quo-Warranto: By what authority? (inquires legality of public claim)', createdAt: '2026-05-21T08:00:00Z', tags: ['Writs', 'Article 32', 'Polity Premium'], isPinned: true, isBookmarked: false }
];

export const INITIAL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 'iq1', question: 'Tell us about yourself, your background, and why you want to join West Bengal State Civil Services despite having diverse career prospects.', answerDraft: 'Start with native place, schooling in Bengali/English medium, high focus during graduation. Highlight that WBCS gives administrative powers to impact schemes at block level (BDO rank) directly, driving immediate rural progress.', category: 'HR', confidence: 'MEDIUM' },
  { id: 'iq2', question: 'What are the main administrative problems currently faced by your native district?', answerDraft: 'If South 24 Parganas: Mention sea-level rise, salinity damage to paddy crops, high dependence on migrant work, and remote connectivity in Sundarban deltas. Emphasize multi-agency solutions.', category: 'DISTRICT', confidence: 'LOW' },
  { id: 'iq3', question: 'How is the Governor and Chief Minister relationship governed under Article 163 and Article 167?', answerDraft: 'Governor must act on aid and advice of Council of Ministers (Art 163). CM is bound to communicate all administrative and policy proposals (Art 167). Conflict should be resolved through federal conventions.', category: 'OPTIONAL', confidence: 'HIGH' },
  { id: 'iq4', question: 'How would you handle a sudden agitation by a farmers association blocking an interstate highway under your block?', answerDraft: '1. Avoid immediate escalations. Move to site.\n2. Initiate dialogue with leaders.\n3. Offer a safe delegation talk with DM or Agriculture Officer.\n4. Secure route diversion for emergency vehicles. Maintain peace without excessive force unless damage to public property occurs.', category: 'SITUATIONAL', confidence: 'MEDIUM' }
];

export const INITIAL_MOCK_FEEDBACKS: MockFeedback[] = [
  { id: 'f1', date: '2026-05-10', panelMessage: 'Impressive command over district specifics, but needs better eye contact and slightly slower pacing of answers during constitutional questions.', score: 142, positivePoints: ['Clear and humble speaking tone', 'Thorough awareness of local developmental issues in West Bengal'], improvementPoints: ['Do not rush during complex legal provisions answers', 'Practice keeping posture straight and hands resting on lap'] }
];

export const INITIAL_STUDY_LOGS: StudyLog[] = [
  { date: '2026-05-08', hours: 6.5, tasksCompleted: 4, activeStreak: 8 },
  { date: '2026-05-09', hours: 7.0, tasksCompleted: 5, activeStreak: 9 },
  { date: '2026-05-10', hours: 5.0, tasksCompleted: 3, activeStreak: 10 },
  { date: '2026-05-11', hours: 8.0, tasksCompleted: 6, activeStreak: 11 },
  { date: '2026-05-12', hours: 7.5, tasksCompleted: 5, activeStreak: 12 },
  { date: '2026-05-13', hours: 4.5, tasksCompleted: 3, activeStreak: 13 },
  { date: '2026-05-14', hours: 6.0, tasksCompleted: 4, activeStreak: 14 },
  { date: '2026-05-15', hours: 7.2, tasksCompleted: 5, activeStreak: 15 },
  { date: '2026-05-16', hours: 8.5, tasksCompleted: 6, activeStreak: 16 },
  { date: '2026-05-17', hours: 5.5, tasksCompleted: 3, activeStreak: 17 },
  { date: '2026-05-18', hours: 9.0, tasksCompleted: 7, activeStreak: 18 },
  { date: '2026-05-19', hours: 8.0, tasksCompleted: 6, activeStreak: 19 },
  { date: '2026-05-20', hours: 6.8, tasksCompleted: 4, activeStreak: 20 },
  { date: '2026-05-21', hours: 8.5, tasksCompleted: 6, activeStreak: 21 },
  { date: '2026-05-22', hours: 5.2, tasksCompleted: 3, activeStreak: 22 }
];

export const INITIAL_REMINDERS: Reminder[] = [
  { id: 'rem-1', title: 'Review Indus Valley & Buddhism questions duo', date: '2026-05-22', type: 'REVISION', isCompleted: false },
  { id: 'rem-2', title: 'Prelims Full-Length Test 4 - Scheduled Sunday', date: '2026-05-24', type: 'MOCK', isCompleted: false },
  { id: 'rem-3', title: 'Clear backlogs: Science Sound & Light chapters', date: '2026-05-23', type: 'BACKLOG', isCompleted: false },
  { id: 'rem-4', title: 'Complete monthly CA compilation for April', date: '2026-05-28', type: 'TARGET', isCompleted: false }
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Your hard work, perseverance, and dedication will pave your way to the Writers' Building.", author: "WBCS Mentor" },
  { text: "Success represents the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Focus on the process of becoming an expert administrator, not just clear the exam.", author: "Civil Servant Practice" },
  { text: "The harder you work for something, the greater you will feel when you achieve it.", author: "Anonymous" }
];

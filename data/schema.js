const ASSESSMENT_SCHEMA = {
  maxTotalScore: 428,
  classification: [
    { max: 30, label: "Weak alignment", color: "#dc3545", description: "Mostly project-mode or activity-led" },
    { max: 50, label: "Emerging alignment", color: "#fd7e14", description: "Some place or enterprise thinking exists" },
    { max: 70, label: "Moderate alignment", color: "#ffc107", description: "Good base for local economy work" },
    { max: 85, label: "Strong alignment", color: "#28a745", description: "Ready for pilot or deeper collaboration" },
    { max: 100, label: "Very high alignment", color: "#1a7a37", description: "Potential anchor / ecosystem partner" }
  ],
  sections: [
    {
      id: "A",
      name: "Place Ownership & Local Economy Orientation",
      maxScore: 32,
      questions: [
        { id: "A1", text: "Has the organisation clearly defined its geography of work: village, cluster, watershed, block, landscape or constituency?" },
        { id: "A2", text: "Does it understand local household and institutional consumption needs — food, inputs, services, repair, energy, materials, etc.?" },
        { id: "A3", text: "Has it mapped what is currently imported into the local economy that could potentially be produced or serviced locally?" },
        { id: "A4", text: "Has it mapped existing local production systems: crops, livestock, forest produce, crafts, skills, services, repair systems?" },
        { id: "A5", text: "Does it understand existing local market flows: traders, haats, aggregators, buyers, processors, local shops?" },
        { id: "A6", text: "Does it identify local risks: migration, ecological stress, market volatility, climate risk, resource depletion?" },
        { id: "A7", text: "Does it see livelihoods as part of a local economy, not just as beneficiary income enhancement?" },
        { id: "A8", text: "Does it have a clear view of who locally owns, operates and governs livelihood activities?" }
      ]
    },
    {
      id: "B",
      name: "Ecology Alignment",
      maxScore: 32,
      questions: [
        { id: "B1", text: "Does the organisation map local natural assets: soil, water, biomass, forests, crops, livestock, biodiversity?" },
        { id: "B2", text: "Does it assess whether proposed enterprises can be run without degrading local ecology?" },
        { id: "B3", text: "Are agroecology and natural resource management connected to livelihood planning?" },
        { id: "B4", text: "Does it avoid enterprises that increase extraction, pollution, waste or monoculture risk?" },
        { id: "B5", text: "Does it prioritise circular use of local materials, by-products and waste streams?" },
        { id: "B6", text: "Does it track climate vulnerability and adaptation relevance of proposed livelihoods?" },
        { id: "B7", text: "Are community members involved in deciding what is ecologically appropriate?" },
        { id: "B8", text: "Does it view ecology as a foundation for livelihoods rather than an external safeguard?" }
      ]
    },
    {
      id: "C",
      name: "Community Ownership & Governance",
      maxScore: 32,
      questions: [
        { id: "C1", text: "Are SHGs, FPOs, youth groups, artisans or local entrepreneurs central to enterprise design?" },
        { id: "C2", text: "Are panchayats or local governance institutions engaged meaningfully?" },
        { id: "C3", text: "Are local community stewards identified and supported?" },
        { id: "C4", text: "Does the organisation build local decision-making capacity rather than only delivering external solutions?" },
        { id: "C5", text: "Are women's collectives involved as owners or operators, not only trainees or workers?" },
        { id: "C6", text: "Are youth positioned as entrepreneurs, service providers, technicians or digital enablers?" },
        { id: "C7", text: "Is there a governance model for revenue, asset ownership, risk-sharing and maintenance?" },
        { id: "C8", text: "Can the local group adapt the enterprise model after the project period ends?" }
      ]
    },
    {
      id: "D",
      name: "Enterprise Creation Pathway",
      maxScore: 32,
      questions: [
        { id: "D1", text: "Does the organisation begin with local demand and needs sensing before selecting livelihood options?" },
        { id: "D2", text: "Does it compare multiple enterprise opportunities before choosing one?" },
        { id: "D3", text: "Are opportunities chosen based on local assets, skills, demand, ecology and market viability?" },
        { id: "D4", text: "Does it prepare a basic enterprise model before implementation?" },
        { id: "D5", text: "Does the enterprise model include unit economics, working capital, risk and governance?" },
        { id: "D6", text: "Are pilots or demonstrations conducted before scaling?" },
        { id: "D7", text: "Does the organisation document what works and what fails?" },
        { id: "D8", text: "Are successful models converted into playbooks, SOPs, training modules or replication guides?" }
      ]
    },
    {
      id: "E",
      name: "6M Enterprise Readiness",
      maxScore: 48,
      questions: [
        { id: "E1", text: "Manpower: Are local operators, trainers, technicians or entrepreneurs identified?" },
        { id: "E2", text: "Manpower: Is there a plan for skilling, handholding and peer learning?" },
        { id: "E3", text: "Machine: Are required tools, machines or infrastructure clearly identified?" },
        { id: "E4", text: "Machine: Are repair, maintenance and local service options available?" },
        { id: "E5", text: "Material: Are raw materials locally available, seasonal and ecologically sustainable?" },
        { id: "E6", text: "Material: Are quality standards and storage needs understood?" },
        { id: "E7", text: "Method: Are SOPs, process flows, recipes, production methods or technical protocols available?" },
        { id: "E8", text: "Method: Is there a mechanism for troubleshooting and improving the process?" },
        { id: "E9", text: "Money: Are capital cost, working capital, margins and payback period calculated?" },
        { id: "E10", text: "Money: Are grants, loans, schemes, CSR, community contribution or blended finance options mapped?" },
        { id: "E11", text: "Market: Are local, institutional, B2B and external markets mapped?" },
        { id: "E12", text: "Market: Are buyer relationships, pricing, packaging, branding or aggregation models defined?" }
      ]
    },
    {
      id: "F",
      name: "Local Production Economy Potential",
      maxScore: 32,
      questions: [
        { id: "F1", text: "Does the organisation identify products or services currently bought from outside that could be produced locally?" },
        { id: "F2", text: "Does it work on value addition closer to the origin of raw material?" },
        { id: "F3", text: "Does it connect farmers, SHGs, FPOs, youth and local businesses into one value chain?" },
        { id: "F4", text: "Does it create opportunities across multiple roles: producer, processor, service provider, trader, repairer, aggregator?" },
        { id: "F5", text: "Does it strengthen local circulation of money within the place?" },
        { id: "F6", text: "Does it consider local institutional demand: schools, anganwadis, hostels, hospitals, panchayats, SHGs, FPOs?" },
        { id: "F7", text: "Does it track import substitution or local value retention?" },
        { id: "F8", text: "Does it build resilience against migration, market shocks or climate shocks?" }
      ]
    },
    {
      id: "G",
      name: "Existing Local Ecosystem & Informal Support Systems",
      maxScore: 32,
      questions: [
        { id: "G1", text: "Has the organisation mapped informal local helpers, fixers, trainers, advisors and entrepreneurs?" },
        { id: "G2", text: "Has it identified local traders, aggregators, haat buyers, commission agents and market intermediaries?" },
        { id: "G3", text: "Has it mapped repair shops, fabrication sheds, tool rooms, ITIs, KVKs or maker-like spaces?" },
        { id: "G4", text: "Has it identified local peer learning groups such as SHGs, youth groups and producer collectives?" },
        { id: "G5", text: "Does it treat existing informal actors as assets rather than bypassing them?" },
        { id: "G6", text: "Does it organise these actors into dependable service pathways?" },
        { id: "G7", text: "Does it strengthen quality, reliability and access without replacing local actors?" },
        { id: "G8", text: "Does it maintain a local directory or knowledge base of these support actors?" }
      ]
    },
    {
      id: "H",
      name: "Nine Platform Components Readiness",
      maxScore: 36,
      questions: [
        { id: "H1", text: "Production Help Platforms: Does the organisation provide or enable practical production help through calls, WhatsApp groups, field support, helplines or local coordinators?" },
        { id: "H2", text: "Local Economy Tools & Narratives: Does it create crop maps, price notes, value-chain maps, local economy stories or village enterprise tools?" },
        { id: "H3", text: "Skill & Incubation Network: Does it connect communities to structured training, incubation, KVKs, ITIs, NGOs or enterprise support?" },
        { id: "H4", text: "Mentor Network & Consulting: Does it connect local entrepreneurs to mentors, technical experts, retired professionals or experienced entrepreneurs?" },
        { id: "H5", text: "Trader Network: Does it map and engage traders, buyers, aggregators and B2B market actors?" },
        { id: "H6", text: "Makerspaces & Self-Learning: Does it provide access to tools, machines, repair spaces, labs or hands-on experimentation spaces?" },
        { id: "H7", text: "Peer Learning & Community: Does it support peer groups, exposure sharing, learning circles or entrepreneur communities?" },
        { id: "H8", text: "Exposures & Clinics: Does it organise demonstrations, troubleshooting camps, exposure visits or short clinics?" },
        { id: "H9", text: "Business Support Programmes: Does it support compliance, accounting, registrations, bank linkage, schemes, GST, packaging, branding or licences?" }
      ]
    },
    {
      id: "I",
      name: "POESI Architecture Fit",
      maxScore: 24,
      questions: [
        { id: "I1", text: "Place: Does the organisation bring deep understanding of local needs, assets, ecology, spend and market flows?" },
        { id: "I2", text: "Owners: Does it work with panchayats, SHGs, FPOs, youth, artisans or community entrepreneurs as owners?" },
        { id: "I3", text: "Enablers: Does it connect mentors, institutes, trainers, traders, local businesses or CSOs?" },
        { id: "I4", text: "Solutions: Does it contribute to 6M solution stacks: playbooks, trainers, machines, vendors, finance, SOPs or market links?" },
        { id: "I5", text: "Infrastructure: Does it help build platforms, data, knowledge commons, maker spaces, public scheme linkages or policy rails?" },
        { id: "I6", text: "Integration: Does it assemble actors around the place rather than bringing a fixed solution to the place?" }
      ]
    },
    {
      id: "J",
      name: "Market, Finance & Sustainability",
      maxScore: 32,
      questions: [
        { id: "J1", text: "Does the organisation understand demand before starting production?" },
        { id: "J2", text: "Are customers, buyers or procurement channels identified before investment?" },
        { id: "J3", text: "Are local markets treated as partners rather than obstacles?" },
        { id: "J4", text: "Does the model include pricing, margins and working capital?" },
        { id: "J5", text: "Are multiple financing routes mapped: community capital, loans, schemes, CSR, grants, buyer advances?" },
        { id: "J6", text: "Is there clarity on who bears risk if the enterprise fails?" },
        { id: "J7", text: "Does the organisation track revenue, profit, cash flow and repayment?" },
        { id: "J8", text: "Can the enterprise continue after grant or project support ends?" }
      ]
    },
    {
      id: "K",
      name: "Platformisation & Servicification Readiness",
      maxScore: 32,
      questions: [
        { id: "K1", text: "Does the organisation package its knowledge as services, tools, playbooks or modules?" },
        { id: "K2", text: "Can its support be accessed on demand by other places or partners?" },
        { id: "K3", text: "Does it document service providers, trainers, vendors, costs and methods?" },
        { id: "K4", text: "Does it collaborate with other organisations rather than working in isolation?" },
        { id: "K5", text: "Can it contribute to a shared knowledge base or solution platform?" },
        { id: "K6", text: "Does it capture feedback from users and improve its services?" },
        { id: "K7", text: "Can its model be hosted, strengthened or replicated by others?" },
        { id: "K8", text: "Does it think of itself as an ecosystem enabler, not only a project implementer?" }
      ]
    },
    {
      id: "L",
      name: "Evidence, Learning & Replication",
      maxScore: 32,
      questions: [
        { id: "L1", text: "Does the organisation maintain data on places, households, enterprises and value chains?" },
        { id: "L2", text: "Does it track enterprises designed and deployed?" },
        { id: "L3", text: "Does it track local income, value addition or import substitution?" },
        { id: "L4", text: "Does it document failures and reasons for failure?" },
        { id: "L5", text: "Does it create evidence useful for funders, policy or public goods?" },
        { id: "L6", text: "Does it maintain playbooks, case studies or replication notes?" },
        { id: "L7", text: "Does it use feedback from communities and entrepreneurs to improve design?" },
        { id: "L8", text: "Can its work be replicated across nearby geographies without losing place sensitivity?" }
      ]
    },
    {
      id: "M",
      name: "Collaboration Fit with Rainmatter / GRE / GramEEE-type Ecosystem",
      maxScore: 32,
      questions: [
        { id: "M1", text: "Is the organisation open to sharing knowledge, methods and service-provider information?" },
        { id: "M2", text: "Can it contribute to solution discovery for local production economies?" },
        { id: "M3", text: "Can it help identify ground needs from communities and convert them into structured demand?" },
        { id: "M4", text: "Can it host or support pilots in 2–3 places?" },
        { id: "M5", text: "Can it onboard local trainers, entrepreneurs, vendors or service providers?" },
        { id: "M6", text: "Can it help build 6M depth for priority products or value chains?" },
        { id: "M7", text: "Can it support translation, localisation and community-facing communication?" },
        { id: "M8", text: "Can it participate in a network where multiple partners solve different parts of the enterprise stack?" }
      ]
    }
  ]
};

const PARTNER_TYPES = [
  {
    id: "place-anchor",
    name: "Place Anchor",
    description: "Deep place-based understanding and local economy orientation",
    check: function(scores) {
      const relevant = ["A", "B", "C", "F", "G", "I"];
      return { relevant, threshold: 70 };
    },
    suggestedRole: "Lead place-based livelihood planning, coordinate local economy mapping and anchor multi-stakeholder convergence in a geography."
  },
  {
    id: "community-mobiliser",
    name: "Community Mobiliser",
    description: "Strong community trust, governance and peer learning capacity",
    check: function(scores) {
      return { relevant: ["C", "G", "H7", "M"], threshold: 70 };
    },
    suggestedRole: "Mobilise communities, strengthen local governance, facilitate peer learning and ensure community ownership."
  },
  {
    id: "production-partner",
    name: "Production / Technical Partner",
    description: "Strong enterprise creation and 6M readiness",
    check: function(scores) {
      return { relevant: ["E", "D", "H1", "H3", "H4", "H6"], threshold: 70 };
    },
    suggestedRole: "Lead technical production support, manage 6M deployment, train local entrepreneurs and build production capacity."
  },
  {
    id: "market-partner",
    name: "Market Partner",
    description: "Market linkages, finance and demand-side strength",
    check: function(scores) {
      return { relevant: ["J", "H5", "F", "E11", "E12"], threshold: 70 };
    },
    suggestedRole: "Own market connections, buyer relationships, brand-building and market access for local producers."
  },
  {
    id: "skill-partner",
    name: "Skill & Training Partner",
    description: "Manpower development and skill-building expertise",
    check: function(scores) {
      return { relevant: ["E1", "E2", "H3", "H7", "H8"], threshold: 70 };
    },
    suggestedRole: "Design and deliver skill training, manage apprenticeship pipelines and build local workforce capacity."
  },
  {
    id: "finance-partner",
    name: "Finance / Scheme Partner",
    description: "Financial access, scheme linkage and capital planning",
    check: function(scores) {
      return { relevant: ["E9", "E10", "J", "H9"], threshold: 70 };
    },
    suggestedRole: "Map and access financial products, link communities to government schemes and manage blended finance."
  },
  {
    id: "platform-partner",
    name: "Platform / Knowledge Partner",
    description: "Knowledge management, platform thinking and evidence building",
    check: function(scores) {
      return { relevant: ["K", "L", "H2", "I5"], threshold: 70 };
    },
    suggestedRole: "Build knowledge platforms, document evidence, create playbooks and manage learning systems."
  },
  {
    id: "replication-partner",
    name: "Replication Partner",
    description: "Ability to scale and replicate across geographies",
    check: function(scores) {
      return { relevant: ["D", "K", "L", "M"], threshold: 70 };
    },
    suggestedRole: "Lead replication across geographies, adapt models to new contexts and build scalable playbooks."
  },
  {
    id: "ecology-partner",
    name: "Ecology / NRM Anchor",
    description: "Ecology and natural resource management orientation",
    check: function(scores) {
      return { relevant: ["B", "A", "F", "I1"], threshold: 70 };
    },
    suggestedRole: "Lead ecological assessments, natural asset mapping and ensure environmental sustainability."
  },
  {
    id: "infrastructure-partner",
    name: "Infrastructure Partner",
    description: "Platform infrastructure and ecosystem building capacity",
    check: function(scores) {
      return { relevant: ["I5", "H", "K", "M"], threshold: 70 };
    },
    suggestedRole: "Build shared infrastructure, digital platforms, maker spaces and support systems."
  }
];

const JOURNEY_STAGES = [
  {
    stage: 0,
    name: "Orientation needed",
    range: [0, 30],
    actions: [
      "Introduce Livelihoods & Entrepreneurship Thesis",
      "Map existing work with the partner",
      "Identify whether partner has place depth, community trust or technical capability",
      "Do not start enterprise pilot yet"
    ]
  },
  {
    stage: 1,
    name: "Alignment discovery",
    range: [31, 50],
    actions: [
      "Conduct partner workshop on thesis framework",
      "Complete Place, Ownership, Ecology and 6M baseline",
      "Identify possible POESI role for the partner",
      "Select 1–2 opportunity areas for deeper study"
    ]
  },
  {
    stage: 2,
    name: "Pilot readiness building",
    range: [51, 70],
    actions: [
      "Select 1–2 place pilots with partner",
      "Complete Basket of Needs assessment",
      "Map local imports, assets and enterprise gaps",
      "Build product-wise 6M sheets",
      "Identify local owners and support actors"
    ]
  },
  {
    stage: 3,
    name: "Demonstration partner",
    range: [71, 85],
    actions: [
      "Launch 1–3 local production economy pilots",
      "Build 6M deployment stack",
      "Track unit economics, ecology safeguards and community ownership",
      "Document playbooks and service-provider directories"
    ]
  },
  {
    stage: 4,
    name: "Anchor / replication partner",
    range: [86, 100],
    actions: [
      "Use as anchor partner for place-based livelihood economy pilots",
      "Build shared solution stack",
      "Convert knowledge into playbooks, tools, templates and evidence",
      "Support replication across regions",
      "Contribute to policy, public goods and shared infrastructure"
    ]
  }
];

const GAP_RECOMMENDATIONS = [
  { section: "A", threshold: 60, recommendation: "Place and Basket of Needs mapping required" },
  { section: "B", threshold: 60, recommendation: "Ecology and natural asset assessment required" },
  { section: "C", threshold: 60, recommendation: "Community ownership and governance design required" },
  { section: "E", threshold: 60, recommendation: "Product-wise 6M readiness work required" },
  { section: "J", threshold: 60, recommendation: "Market, finance and unit economics work required" },
  { section: "K", threshold: 60, recommendation: "Platformisation and service packaging required" },
  { section: "L", threshold: 60, recommendation: "Evidence, MIS and learning system design required" }
];

const DEMO_PARTNERS = [
  { name: "PRADAN", totalScore: 372, sections: { A: 28, B: 28, C: 28, D: 28, E: 42, F: 28, G: 28, H: 31, I: 21, J: 28, K: 28, L: 28, M: 26 } },
  { name: "Buzz Women", totalScore: 383, sections: { A: 29, B: 29, C: 29, D: 29, E: 43, F: 29, G: 29, H: 32, I: 21, J: 29, K: 29, L: 29, M: 26 } },
  { name: "Lipok Social Foundation", totalScore: 386, sections: { A: 29, B: 29, C: 29, D: 29, E: 43, F: 29, G: 29, H: 32, I: 22, J: 29, K: 29, L: 29, M: 28 } },
  { name: "JECP", totalScore: 393, sections: { A: 29, B: 29, C: 29, D: 29, E: 44, F: 29, G: 29, H: 33, I: 22, J: 29, K: 29, L: 29, M: 33 } },
  { name: "TRIF", totalScore: 391, sections: { A: 29, B: 29, C: 29, D: 29, E: 44, F: 29, G: 29, H: 33, I: 22, J: 29, K: 29, L: 29, M: 31 } },
  { name: "Shivganga Jhabua", totalScore: 376, sections: { A: 28, B: 28, C: 28, D: 28, E: 42, F: 28, G: 28, H: 32, I: 21, J: 28, K: 28, L: 28, M: 29 } },
  { name: "VAAGDHARA", totalScore: 391, sections: { A: 29, B: 29, C: 29, D: 29, E: 44, F: 29, G: 29, H: 33, I: 22, J: 29, K: 29, L: 29, M: 31 } },
  { name: "Himalay Unnati Mission", totalScore: 369, sections: { A: 28, B: 28, C: 28, D: 28, E: 41, F: 28, G: 28, H: 31, I: 21, J: 28, K: 28, L: 28, M: 24 } },
  { name: "Gram Vikas", totalScore: 395, sections: { A: 30, B: 30, C: 30, D: 30, E: 44, F: 30, G: 30, H: 33, I: 22, J: 30, K: 30, L: 30, M: 26 } },
  { name: "Common Ground", totalScore: 390, sections: { A: 29, B: 29, C: 29, D: 29, E: 44, F: 29, G: 29, H: 33, I: 22, J: 29, K: 29, L: 29, M: 30 } }
];

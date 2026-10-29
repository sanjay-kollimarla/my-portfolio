export const profile = {
  name: "Kollimarla Sai Sanjay",
  firstName: "Sai Sanjay",
  lastName: "Kollimarla",
  initials: "SK",
  title: "Software Engineer",
  roles: ["Backend Engineer", "Full-Stack Developer", "System Designer"],
  location: "Hyderabad, India",
  phone: "+91 7997873456",
  email: "sanju.koli2500@gmail.com",
  linkedin: "https://linkedin.com/in/kollimarla-sai-sanjay",
  github: "https://github.com/sanjay-kollimarla",
  summary:
    "Software Engineer with 3+ years of experience designing and building scalable backend systems using Node.js, TypeScript, JavaScript, SQL, MongoDB, Redis and AWS. Experienced in architecting multi-tenant SaaS applications, developing distributed backend services, optimizing database performance, designing asynchronous processing pipelines, and building real-time applications. Strong foundation in Data Structures & Algorithms, System Design, Distributed Systems, Database Design, Scalability, Performance Optimization and end-to-end ownership of production software.",
};

export const stats = [
  { value: 3, suffix: "+", label: "Years building production software" },
  { value: 40, suffix: "+", label: "RBAC permission types designed" },
  { value: 70, suffix: "%", label: "Faster AI content generation" },
  { value: 5, suffix: "+", label: "SME clients delivered end-to-end" },
];

export const skillGroups = [
  { title: "Languages", icon: "</>", color: "#a855f7", items: ["Java", "TypeScript", "JavaScript", "Python", "SQL"] },
  { title: "Frontend", icon: "◐", color: "#22d3ee", items: ["HTML", "CSS", "Tailwind CSS", "Bootstrap", "Framer Motion"] },
  {
    title: "Frameworks & Libraries",
    icon: "⚛",
    color: "#f472b6",
    items: ["React.js", "Next.js", "Angular", "Express.js", "TanStack Query"],
  },
  {
    title: "Backend & Realtime",
    icon: "⚙",
    color: "#34d399",
    items: ["Node.js", "REST APIs", "WebSockets", "SSE", "BullMQ", "JWT Auth", "RBAC"],
  },
  { title: "Databases & Caching", icon: "⛁", color: "#facc15", items: ["MongoDB", "MySQL", "Redis"] },
  { title: "DevOps & Cloud", icon: "☁", color: "#fb923c", items: ["AWS S3", "Docker", "Git", "GitHub"] },
  { title: "Build & Tools", icon: "⚒", color: "#818cf8", items: ["Vite", "Webpack", "Postman"] },
];

export const coreConcepts = [
  "Data Structures & Algorithms",
  "System Design",
  "Distributed Systems",
  "Database Design",
  "Data Modeling",
  "Scalability",
  "Fault Tolerance",
  "High Availability",
  "Caching",
  "Concurrency",
  "Asynchronous Processing",
  "Event-Driven Architecture",
  "Performance Optimization",
  "Design Patterns",
  "CI/CD",
  "RBAC",
];

export const experience = [
  {
    company: "NexusIQ Solutions",
    role: "Software Engineer",
    period: "Feb 2024 — Present",
    year: "NOW",
    current: true,
    tags: ["Node.js", "TypeScript", "MongoDB", "AWS S3", "WebSockets"],
    points: [
      "Designed and implemented a multi-tenant backend architecture serving multiple organizations with secure tenant isolation and configurable authorization.",
      "Architected RESTful backend services using Node.js and TypeScript supporting concurrent exam workflows with role-based access control across 40+ permission types.",
      "Optimized MongoDB queries through indexing, aggregation pipeline improvements and schema redesign, reducing API latency for high-volume operations.",
      "Built asynchronous processing pipelines for AI-assisted question generation and evaluation, improving content generation efficiency by over 70%.",
      "Integrated AWS S3 storage for scalable media management with secure upload/download workflows.",
      "Designed real-time browser monitoring services using Web APIs and WebSockets to support low-latency exam supervision.",
      "Owned features through architecture, implementation, deployment, production support and performance optimization.",
    ],
  },
  // {
  //   company: "Freelance",
  //   role: "Full Stack Developer",
  //   period: "May 2023 — Jan 2024",
  //   year: "2023",
  //   tags: ["MEAN", "MERN", "Caching", "Indexing"],
  //   points: [
  //     "Delivered end-to-end MEAN/MERN applications from requirements gathering through architecture, development and deployment for 5+ SME clients.",
  //     "Optimized API response times by up to 40% through database query optimization, indexing and caching.",
  //   ],
  // },
  {
    company: "Upgrad Insofe",
    role: "Junior Software Engineer",
    period: "Nov 2022 — Apr 2023",
    year: "2022",
    tags: ["Angular", "Node.js", "ML APIs"],
    points: [
      "Built Angular components and Node.js APIs for analytics dashboards, reducing page load time by 30% through lazy loading.",
      "Collaborated with data engineering teams to integrate machine learning models into production APIs.",
    ],
  },
  {
    company: "Verzeo",
    role: "Machine Learning Intern",
    period: "May 2021 — Jun 2021",
    year: "2021",
    tags: ["Python", "Scikit-learn", "TensorFlow"],
    points: [
      "Developed SVM-based diabetes predictor and handwritten digit recognizer achieving 98% accuracy on the MNIST dataset.",
      "Worked with Pandas, Scikit-learn and TensorFlow for model development.",
    ],
  },
];

export const projects = [
  {
    title: "Production-grade Email Queue Platform",
    short: "Email Queue Platform",
    tagline: "Distributed async email processing that never drops a message.",
    stack: ["Node.js", "TypeScript", "BullMQ", "Redis", "Docker", "REST APIs", "SSE", "Webhooks"],
    flow: ["REST API", "BullMQ · Redis", "Worker Pool", "SSE · Webhooks"],
    accent: "#a78bfa",
    url: "https://sanjay-kollimarla-email-queue.tailc8948a.ts.net/",
    repo: "https://github.com/sanjay-kollimarla/email-queue-system",
    points: [
      "Architected a distributed asynchronous email processing platform using BullMQ and Redis.",
      "Designed retries, exponential backoff, dead-letter queues (DLQ), idempotent processing and failure recovery.",
      "Built horizontally scalable worker architecture with delayed jobs, priority queues and rate limiting.",
      "Implemented real-time delivery tracking using SSE and webhook callbacks.",
      "Optimized Redis queue processing for high throughput and low latency.",
      "Containerized API and worker services using Docker.",
    ],
  },
  {
    title: "Distributed Rate Limiting Service",
    short: "Rate Limiter",
    tagline: "Race-free throttling with atomic Lua scripts on Redis.",
    stack: ["Node.js", "TypeScript", "Redis", "Lua Scripts", "Express"],
    flow: ["Request", "Middleware", "Lua · Redis", "Allow / 429"],
    accent: "#22d3ee",
    url: "https://sanjay-kollimarla-distributed-rate.onrender.com/",
    repo: "https://github.com/sanjay-kollimarla/distributed-rate-limiting-service",
    points: [
      "Designed a centralized distributed rate limiting service using Redis.",
      "Implemented Token Bucket and Sliding Window algorithms.",
      "Leveraged Redis atomic operations and Lua scripts to eliminate race conditions.",
      "Built reusable middleware for configurable request throttling.",
      "Benchmarked algorithms for latency, memory utilization and scalability.",
    ],
  },
  {
    title: "TinyURL — Distributed URL Shortening Service",
    short: "TinyURL",
    tagline: "Read-heavy redirects served from cache in milliseconds.",
    stack: ["Node.js", "TypeScript", "MongoDB", "Redis", "Docker", "AWS"],
    flow: ["Client", "API Gateway", "Redis Cache", "MongoDB"],
    accent: "#f472b6",
    points: [
      "Designed a scalable URL shortening platform with analytics and expiration policies.",
      "Optimized redirect latency using Redis caching and MongoDB.",
      "Designed efficient indexes for read-heavy workloads.",
      "Implemented duplicate detection, click tracking and expiration scheduling.",
      "Documented architecture covering caching, scalability, load balancing and fault tolerance.",
    ],
    url: "https://sanjay-kollimarla-tinyurl-service.onrender.com/",
    repo: "https://github.com/sanjay-kollimarla/TinyURL"
  },
];

export const education = {
  school: "Geethanjali College of Engineering and Technology",
  degree: "Bachelor of Technology — Computer Science & Engineering",
  period: "2019 — 2023",
  cgpa: "7.8 / 10",
  location: "Hyderabad, Telangana",
};

export const certifications = [
  { title: "Full Stack Development", detail: "HTML, CSS, JavaScript, React, Node.js", issuer: "NxtWave" },
  { title: "Java Full Stack", detail: "Enterprise Java development", issuer: "Wipro TalentNext" },
  { title: "Machine Learning using Python", detail: "Supervised learning & model building", issuer: "Verzeo" },
  { title: "Git, SQL, Command Line & Responsive Design", detail: "Developer fundamentals", issuer: "NxtWave" },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const whatIDo = [
  {
    title: "Backend",
    titleAccent: "Engineering",
    blurb:
      "Multi-tenant SaaS backends, distributed services and asynchronous pipelines that stay fast, isolated and fault tolerant under real production load.",
    skills: ["Node.js", "TypeScript", "Express", "BullMQ", "Redis", "MongoDB", "MySQL", "WebSockets", "SSE", "AWS S3", "Docker", "RBAC"],
  },
  {
    title: "Full-Stack",
    titleAccent: "Development",
    blurb:
      "End-to-end MEAN / MERN products, from requirements and architecture to responsive React or Angular interfaces, deployment and production support.",
    skills: ["React.js", "Next.js", "Angular", "TanStack Query", "Framer Motion", "Tailwind CSS", "Node.js", "REST APIs", "JWT Auth", "Vite", "Webpack", "Git"],
  },
];


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitMerge, 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Bookmark, 
  Play, 
  Compass, 
  Boxes 
} from 'lucide-react';

interface SkillNode {
  id: string;
  label: string;
  description: string;
  level: 'Foundation' | 'Core' | 'Advanced' | 'Expert';
  x: number;
  y: number;
  parents: string[];
  resources: { name: string; url: string; type: string }[];
  studyPrompt: string;
  status: 'locked' | 'unlocked' | 'completed';
}

const SKILL_TREES: Record<string, SkillNode[]> = {
  'Frontend Developer': [
    {
      id: 'html_css',
      label: 'Semantic HTML & CSS Layouts',
      description: 'Master clean modular DOM layout patterns, Flexbox, Grid systems, and accessibility parameters (ARIA).',
      level: 'Foundation',
      x: 100,
      y: 100,
      parents: [],
      resources: [
        { name: 'MDN Web Docs: CSS Layouts', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout', type: 'Documentation' },
        { name: 'CSS Grid Garden Game', url: 'https://cssgridgarden.com/', type: 'Interactive' }
      ],
      studyPrompt: 'Act as a senior frontend engineer. Explain semantic layout strategies to prevent layout shifts. Provide a sample CSS layout using Grid areas for a bento-style landing page dashboard.',
      status: 'completed'
    },
    {
      id: 'js_es6',
      label: 'JS ES6+ & Async Control Flow',
      description: 'Advanced modern JavaScript scopes, closures, high-order array functions, Promises, and reactive event loops.',
      level: 'Foundation',
      x: 100,
      y: 250,
      parents: [],
      resources: [
        { name: 'Eloquent JavaScript - Async', url: 'https://eloquentjavascript.net/11_async.html', type: 'Book' },
        { name: 'Javascript.info - Event Loop', url: 'https://javascript.info/event-loop', type: 'Tutorial' }
      ],
      studyPrompt: 'Generate a study prompt testing sequential async execution: Write an API client with fetch/async-await that retries failed requests with exponential backoff up to 3 times.',
      status: 'completed'
    },
    {
      id: 'react_core',
      label: 'React Engine & SPA Architecture',
      description: 'Component lifecycles, hook state management optimization, concurrent mode, and fiber tree reconciliation.',
      level: 'Core',
      x: 350,
      y: 120,
      parents: ['html_css', 'js_es6'],
      resources: [
        { name: 'React Dev Docs: State Management', url: 'https://react.dev/learn/managing-state', type: 'Docs' },
        { name: 'A Visual Guide to React Reconciliation', url: 'https://react.dev/reference/react/hooks', type: 'Video' }
      ],
      studyPrompt: 'Design a nested interactive tree structure component in React. Minimize re-renders by lazy updating state or utilizing React.memo. Provide a comprehensive code explanation.',
      status: 'unlocked'
    },
    {
      id: 'state_mgmt',
      label: 'State Engines & Prop Streams',
      description: 'Advanced state stores like Zustand, Redux Toolkit, or React Context optimization with stable dependency guards.',
      level: 'Core',
      x: 350,
      y: 280,
      parents: ['react_core'],
      resources: [
        { name: 'Zustand Official Quickstart Guide', url: 'https://zustand-demo.pmnd.rs/', type: 'Quickstart' }
      ],
      studyPrompt: 'Compare Zustand and Redux Toolkit for complex multi-screen dashboard applications. Provide an optimal store structure with actions to manage user configurations.',
      status: 'unlocked'
    },
    {
      id: 'css_engines',
      label: 'Tailwind CSS & Token Styling Designers',
      description: 'Systematic utility designs, custom design tokens configuration, and responsive viewport orchestration.',
      level: 'Core',
      x: 350,
      y: 400,
      parents: ['html_css'],
      resources: [
        { name: 'Tailwind CSS Best Practices Guide', url: 'https://tailwindcss.com/docs', type: 'Guide' }
      ],
      studyPrompt: 'Draft an absolute masterclass responsive landing hero component code strictly styled with modern Tailwind CSS tokens. Include hover states, active states, and dark-theme configurations.',
      status: 'unlocked'
    },
    {
      id: 'ssr_nextjs',
      label: 'Next.js SSR & Server Actions',
      description: 'Master routing with app-router, server components (RSC), hydration constraints, and progressive stream rendering.',
      level: 'Advanced',
      x: 600,
      y: 180,
      parents: ['react_core', 'state_mgmt'],
      resources: [
        { name: 'Next.js Learn Course', url: 'https://nextjs.org/learn', type: 'Course' }
      ],
      studyPrompt: 'Explain visual differences between static site generation (SSG) and incremental static regeneration (ISR) under the hood. Share full page code parsing an URL search query.',
      status: 'locked'
    },
    {
      id: 'perf_opt',
      label: 'Performance Audit & Core Web Vitals',
      description: 'Analyzing bundle partitions, asset pre-fetching schemes, cumulative layout shifts (CLS), and Largest Contentful Paint (LCP).',
      level: 'Expert',
      x: 820,
      y: 200,
      parents: ['ssr_nextjs'],
      resources: [
        { name: 'Web.dev Core Web Vitals Audit', url: 'https://web.dev/vitals/', type: 'Tool' }
      ],
      studyPrompt: 'Give a comprehensive breakdown of optimizing core web vitals on a React single page application with high data counts. Prepare a checklist containing web workers and lazy assets.',
      status: 'locked'
    }
  ],
  'Software Engineer': [
    {
      id: 'dsa_basics',
      label: 'Data Structures & Algorithmic Complexities',
      description: 'Complexity structures (Big-O), search queries, linear lists, graphs, and hash algorithms.',
      level: 'Foundation',
      x: 100,
      y: 150,
      parents: [],
      resources: [
        { name: 'LeetCode Algorithm Foundations', url: 'https://leetcode.com/', type: 'Practice' },
        { name: 'Visualgo - Interactive Algorithms', url: 'https://visualgo.net/', type: 'Visualizer' }
      ],
      studyPrompt: 'Create a lesson teaching binary search tree insertion and tree search algorithms using standard recursive strategies in TypeScript. Diagram each structural step.',
      status: 'completed'
    },
    {
      id: 'sys_architecture',
      label: 'System Design & Scalable Topography',
      description: 'Tradeoffs of vertical vs horizontal scaling, load balancers, reverse proxies, and microservices.',
      level: 'Core',
      x: 350,
      y: 150,
      parents: ['dsa_basics'],
      resources: [
        { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Guide' }
      ],
      studyPrompt: 'Prepare a complex System Design study curriculum. How do you design an ultra high-throughput real-time message stream (e.g. Chat or Event Tracker) accommodating 120,000 active sockets?',
      status: 'unlocked'
    },
    {
      id: 'db_layer',
      label: 'Databases & Distributed Transactions',
      description: 'SQL Joins, document stores, ACID constraints, database partition indexing, and eventual consistency indexes.',
      level: 'Core',
      x: 350,
      y: 320,
      parents: ['dsa_basics'],
      resources: [
        { name: 'PostgreSQL Indexes Under The Hood', url: 'https://postgresqltutorial.com/', type: 'Documentation' }
      ],
      studyPrompt: 'Explain how relational DB indexes (such as B-Trees) process database scans. Under what conditions do index scans degrade into full scan searches?',
      status: 'unlocked'
    },
    {
      id: 'api_orchestration',
      label: 'API Architecture & REST vs gRPC',
      description: 'Stateless communication, route schemas, token handshake protocols, and schema validation pipelines.',
      level: 'Advanced',
      x: 600,
      y: 230,
      parents: ['sys_architecture', 'db_layer'],
      resources: [
        { name: 'Designing Data-Intensive Applications', url: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/', type: 'Book' }
      ],
      studyPrompt: 'Act as a Senior Principal Architect. Compare REST, GraphQL, and gRPC endpoints across criteria including packet sizes, network latencies, and browser schema-sharing rules.',
      status: 'locked'
    },
    {
      id: 'cloud_infra',
      label: 'CI/CD Pipelines & Cloud Scalers',
      description: 'Container runtimes (Docker), edge ingress routing, zero-downtime deployment rules, and scaling engines.',
      level: 'Expert',
      x: 820,
      y: 230,
      parents: ['api_orchestration'],
      resources: [
        { name: 'AWS & GCP Architectural Checklist', url: 'https://cloud.google.com/docs', type: 'Docs' }
      ],
      studyPrompt: 'Provide a complete GitHub Actions shell configuration compiling and uploading a Node.js fullstack container onto a container engine with direct zero-downtime traffic switches.',
      status: 'locked'
    }
  ],
  'Data Analyst / Scientist': [
    {
      id: 'python_foundations',
      label: 'Python Foundation & Data Containers',
      description: 'Scientific computing basics, pandas structures, dictionary indexing, and dynamic scripting rules.',
      level: 'Foundation',
      x: 100,
      y: 200,
      parents: [],
      resources: [
        { name: 'Kaggle Python Crash Course', url: 'https://www.kaggle.com/learn/python', type: 'Interactive' }
      ],
      studyPrompt: 'Provide a tutorial explaining python list comprehensions, lambda operations, and memory structures. Supply an intermediate dataframe data processing exercise.',
      status: 'completed'
    },
    {
      id: 'pandas_analytics',
      label: 'Pandas Dataframes & Joining Matrices',
      description: 'Vector manipulation, multi-key joins, pivot tables, data-cleansing strategies, and outlier parsing.',
      level: 'Core',
      x: 350,
      y: 120,
      parents: ['python_foundations'],
      resources: [
        { name: 'Official Pandas Query Guide', url: 'https://pandas.pydata.org/docs/', type: 'Documentation' }
      ],
      studyPrompt: 'Write a python script loading transaction data in CSV format, parsing corrupt objects, filtering negative records, and generating a standard normalized aggregate report.',
      status: 'unlocked'
    },
    {
      id: 'sql_joins',
      label: 'Relational SQL Query Engines',
      description: 'Complex window queries (OVER PARTITION), sub-query expressions, inner/outer joins, and aggregation plans.',
      level: 'Core',
      x: 350,
      y: 300,
      parents: ['python_foundations'],
      resources: [
        { name: 'SQLBolt - Interactive SQL Lessons', url: 'https://sqlbolt.com/', type: 'Course' }
      ],
      studyPrompt: 'Prepare a SQL lesson outlining window functions like ROW_NUMBER(), LEAD(), and LAG(). Share recursive CTE structures to navigate enterprise hierarchy directories.',
      status: 'unlocked'
    },
    {
      id: 'data_viz',
      label: 'Visualizing Analytics & D3/Recharts',
      description: 'Visual coding models: scatter plot matrices, cumulative distribution functions (CDF), and bento charts layout.',
      level: 'Advanced',
      x: 600,
      y: 200,
      parents: ['pandas_analytics', 'sql_joins'],
      resources: [
        { name: 'D3 Gallery & Templates', url: 'https://d3js.org/', type: 'Visualization' }
      ],
      studyPrompt: 'Recommend design standards for engineering responsive executive analytics dashboards. Detail font selections, color scales (for color-blind clarity), and optimal chart pairs.',
      status: 'locked'
    },
    {
      id: 'machine_learning',
      label: 'Applied Regression & Machine Learning',
      description: 'Linear/logistic regressions, random forests, feature engineering, and performance metric charts (ROC/AUC).',
      level: 'Expert',
      x: 820,
      y: 200,
      parents: ['data_viz'],
      resources: [
        { name: 'Scikit-Learn Algorithms Guide', url: 'https://scikit-learn.org/', type: 'Documentation' }
      ],
      studyPrompt: 'Explain how random forest ensembles compute feature importances. Provide code training an estimator on classification metrics.',
      status: 'locked'
    }
  ],
  'ML Engineer': [
    {
      id: 'ml_math',
      label: 'Linear Algebra & Calculus Foundations',
      description: 'Gradient ascent/descent algorithms, matrix multipliers, eigenvectors, and backpropagation calculations.',
      level: 'Foundation',
      x: 100,
      y: 200,
      parents: [],
      resources: [
        { name: '3Blue1Brown: Neural Networks', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi', type: 'Video Series' }
      ],
      studyPrompt: 'Derive the gradient of standard binary cross-entropy loss with respect to final fully-connected activation weights. Map out step-by-step.',
      status: 'completed'
    },
    {
      id: 'pytorch_models',
      label: 'PyTorch Layers & Tensor Construction',
      description: 'Object-oriented dataset loaders, feed-forward architectures, custom neural weight layers, and dynamic loss models.',
      level: 'Core',
      x: 350,
      y: 150,
      parents: ['ml_math'],
      resources: [
        { name: 'Official PyTorch Quickstart', url: 'https://pytorch.org/tutorials/', type: 'Quickstart' }
      ],
      studyPrompt: 'Write a full custom training loop in PyTorch containing optimizer step resetting, gradient clipping thresholds, and validation evaluation flags.',
      status: 'unlocked'
    },
    {
      id: 'transformer_layers',
      label: 'Transformers & Self-Attention Engines',
      description: 'Attention weights scoring systems, multi-head alignment, positional encoding keys, and decoding sequences.',
      level: 'Advanced',
      x: 600,
      y: 150,
      parents: ['pytorch_models'],
      resources: [
        { name: 'The Illustrated Transformer Guide', url: 'https://jalammar.github.io/illustrated-transformer/', type: 'Visualization' }
      ],
      studyPrompt: 'Deconstruct "Query", "Key", and "Value" tensors as used in multi-head self-attention mechanisms. Implement attention score computation in clean PyTorch.',
      status: 'locked'
    },
    {
      id: 'ml_operations',
      label: 'Production MLOps & Model Distillation',
      description: 'Fine-tuning networks, quantization schemes (FP16/INT8), Docker-deployed API inference targets, and monitoring models.',
      level: 'Expert',
      x: 820,
      y: 150,
      parents: ['transformer_layers'],
      resources: [
        { name: 'HuggingFace Deployment Endpoints', url: 'https://huggingface.co/docs', type: 'Docs' }
      ],
      studyPrompt: 'Design an production-ready MLOps pipeline hosting an LLM fine-tuned endpoint. Cover model quantization, local caching metrics, and load balancers.',
      status: 'locked'
    }
  ]
};

export const InteractiveSkillTree: React.FC<{ activeRole: string }> = ({ activeRole }) => {
  // Gracefulness mapping: match on selected targetRoles
  const matchedRoleKey = Object.keys(SKILL_TREES).find(
    k => k.toLowerCase() === activeRole.toLowerCase() || activeRole.toLowerCase().includes(k.toLowerCase())
  ) || 'Software Engineer';

  const [nodes, setNodes] = useState<SkillNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Initialise nodes based on active match
    const initialNodes = SKILL_TREES[matchedRoleKey] || SKILL_TREES['Software Engineer'];
    setNodes(initialNodes);
    // Auto-select first foundation node as prompt teaser
    const foundationNode = initialNodes.find(n => n.level === 'Foundation') || initialNodes[0];
    setSelectedNode(foundationNode);
  }, [matchedRoleKey]);

  const handleToggleCompleted = (nodeId: string) => {
    setNodes(prev => {
      const updated = prev.map(n => {
        if (n.id === nodeId) {
          const nextStatusMap: Record<'locked' | 'unlocked' | 'completed', 'locked' | 'unlocked' | 'completed'> = {
            'locked': 'unlocked',
            'unlocked': 'completed',
            'completed': 'unlocked'
          };
          const nextStatus = nextStatusMap[n.status] || 'unlocked';
          
          // Re-evaluate downstream children if unlocked/completed
          return { ...n, status: nextStatus };
        }
        return n;
      });

      // Simple cascading unlocks
      return updated.map(n => {
        if (n.parents.length > 0) {
          // If all parents are completed, unlock item unless it is already completed
          const allParentsDone = n.parents.every(pId => {
            const pNode = updated.find(x => x.id === pId);
            return pNode && pNode.status === 'completed';
          });
          if (allParentsDone && n.status === 'locked') {
            return { ...n, status: 'unlocked' };
          } else if (!allParentsDone && n.status !== 'locked') {
            return { ...n, status: 'locked' };
          }
        }
        return n;
      });
    });
  };

  useEffect(() => {
    if (selectedNode) {
      // Keep selected node state in sync with updated node values
      const currentVal = nodes.find(n => n.id === selectedNode.id);
      if (currentVal && currentVal.status !== selectedNode.status) {
        setSelectedNode(currentVal);
      }
    }
  }, [nodes]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Find helper coordinates to draw curved paths
  const getCurvePath = (x1: number, y1: number, x2: number, y2: number) => {
    // Elegant Bezier curves using secondary control offsets
    const controlPointOffset = Math.abs(x2 - x1) * 0.55;
    return `M ${x1} ${y1} C ${x1 + controlPointOffset} ${y1}, ${x2 - controlPointOffset} ${y2}, ${x2} ${y2}`;
  };

  return (
    <div id="interactive_skill_tree" className="rounded-3xl border border-slate-200/80 dark:border-[#2D2D30]/60 bg-white dark:bg-[#1E293B]/40 p-6 shadow-xs relative overflow-hidden">
      <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
      
      {/* Upper header segment and description detail info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-[#1E1E22] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-violet-500 animate-pulse" />
            <span className="font-display text-base font-black tracking-tight text-slate-805 dark:text-white">
              Dynamic Knowledge Skill Tree ({matchedRoleKey})
            </span>
          </div>
          <p className="text-[11px] text-slate-450 dark:text-[#8E8E93] font-semibold mt-1">
            Visual curriculum dependency graph. Click nodes to unlock study goals, curate external references, and load structured study prompts.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] font-mono uppercase bg-slate-100 dark:bg-[#1C1C1E] text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2D2D30] font-bold">
            Interactive Node Sandbox
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: SVG Visual Node Connection Grid Tree (Spans 7 Cols) */}
        <div className="lg:col-span-7 bg-[#F8FAFC]/55 dark:bg-[#0E0E10]/40 rounded-3xl p-4 border border-slate-150/40 dark:border-[#1F1F24] overflow-x-auto relative">
          
          {/* Main SVG Container */}
          <div className="min-w-[900px] h-[500px] relative select-none">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Dynamic Path Connection render */}
              {nodes.map(node => {
                return node.parents.map(parentId => {
                  const parentNode = nodes.find(n => n.id === parentId);
                  if (!parentNode) return null;

                  const isPathCompleted = parentNode.status === 'completed' && node.status !== 'locked';
                  
                  return (
                    <g key={`${parentNode.id}-${node.id}`}>
                      {/* Drop-shadow trace path */}
                      <path
                        d={getCurvePath(parentNode.x, parentNode.y, node.x, node.y)}
                        fill="none"
                        className="stroke-slate-205 dark:stroke-slate-850/30"
                        strokeWidth="5"
                      />
                      {/* Floating laser connection path */}
                      <motion.path
                        d={getCurvePath(parentNode.x, parentNode.y, node.x, node.y)}
                        fill="none"
                        stroke={isPathCompleted ? 'url(#activePathGrad)' : '#94A3B8'}
                        strokeWidth="2.5"
                        strokeDasharray={!isPathCompleted ? '4 4' : 'none'}
                        className="transition-colors duration-500"
                        animate={isPathCompleted ? {
                          strokeDashoffset: [0, -20]
                        } : {}}
                        transition={{
                          repeat: Infinity,
                          duration: 4,
                          ease: "linear"
                        }}
                      />
                    </g>
                  );
                });
              })}

              <defs>
                {/* Connection Gradients */}
                <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </svg>

            {/* Render HTML elements layered on top of SVG paths to enable robust CSS positioning & hover feedbacks */}
            {nodes.map(node => {
              const isActive = selectedNode?.id === node.id;
              const isCompleted = node.status === 'completed';
              const isLocked = node.status === 'locked';

              let nodeClass = '';
              let ringColor = '';
              let badgeColor = '';

              if (isCompleted) {
                nodeClass = 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/15';
                ringColor = 'ring-emerald-500/20';
                badgeColor = 'bg-emerald-500 text-white';
              } else if (isLocked) {
                nodeClass = 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-[#1A1A1E] dark:border-[#2B2B32] opacity-50 cursor-not-allowed';
                ringColor = 'ring-transparent';
                badgeColor = 'bg-slate-300 dark:bg-[#2B2B32] text-slate-500';
              } else {
                // Unlocked but not completed yet (Active Prep Target Stage!)
                nodeClass = 'bg-violet-500 border-violet-400 text-white shadow-violet-500/25 animate-pulse';
                ringColor = 'ring-violet-500/30';
                badgeColor = 'bg-violet-600 text-white';
              }

              return (
                <motion.div
                  key={node.id}
                  style={{ left: node.x - 70, top: node.y - 45 }}
                  className="absolute w-[150px] text-center pointer-events-auto"
                >
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedNode(node);
                      }
                    }}
                    whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className={`
                      relative flex flex-col items-center justify-center p-3 w-[150px] aspect-video rounded-2xl border cursor-pointer select-none transition-all duration-300 ring-4 ${ringColor} ${nodeClass}
                    `}
                  >
                    {/* Level Identifier Tag */}
                    <span className="absolute -top-2.5 px-2 py-0.5 rounded-full text-[8px] font-mono font-black uppercase tracking-wider shadow-sm z-20 bg-slate-900 border border-slate-800 text-slate-100">
                      {node.level}
                    </span>

                    {/* Skill short summary name */}
                    <span className="font-sans font-black text-[10px] leading-tight text-center tracking-tight break-words pt-1">
                      {node.label}
                    </span>

                    {/* Miniature checkbox state handler */}
                    <div className="absolute -bottom-2 border border-slate-700/10 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md text-[8.5px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm"
                         onClick={(e) => {
                           e.stopPropagation();
                           handleToggleCompleted(node.id);
                         }}
                    >
                      {isCompleted ? '✓ Done' : isLocked ? '🔒 Locked' : '○ Active'}
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive hints */}
          <div className="flex justify-between items-center mt-3 px-3">
            <span className="text-[9.5px] text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" />
              <span>Scroll tree horizontally if you cannot see downstream modules</span>
            </span>
          </div>

        </div>

        {/* Right Side: Skill node deep resource explorer details (Spans 5 Cols) */}
        <div className="lg:col-span-5 self-stretch flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-slate-200/85 dark:border-[#2D2D30]/65 bg-slate-50/50 dark:bg-[#141416]/50 p-5 space-y-5 h-full flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Title & Level description */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-150 dark:border-slate-850 pb-3">
                    <div>
                      <span className="block text-[8.5px] font-mono font-black uppercase tracking-widest text-[#8E8E93]">
                        {selectedNode.level} Module Target
                      </span>
                      <h4 className="font-display font-black text-slate-805 dark:text-white text-base mt-0.5 leading-snug">
                        {selectedNode.label}
                      </h4>
                    </div>
                    
                    {/* Visual status badge flag */}
                    <span className={`px-2.5 py-1 rounded-xl text-[9.5px] font-mono uppercase font-black tracking-wider ${
                      selectedNode.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                    }`}>
                      {selectedNode.status === 'completed' ? 'Done' : 'Target'}
                    </span>
                  </div>

                  {/* Summary context detail */}
                  <p className="text-[11.5px] text-slate-500 dark:text-[#8E8E93] leading-relaxed font-semibold">
                    {selectedNode.description}
                  </p>

                  {/* Curated materials links list */}
                  {selectedNode.resources && selectedNode.resources.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[9.5px] font-mono uppercase tracking-widest text-slate-400 dark:text-[#5E5E65] font-black flex items-center gap-1.5">
                        <BookOpen className="h-3.8 w-3.8 text-violet-500" />
                        <span>Curated Syllabus Materials:</span>
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedNode.resources.map((res, rip) => (
                          <a
                            key={rip}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-[#2D2D30] bg-white dark:bg-[#121214]/65 hover:bg-slate-50 dark:hover:bg-[#1C1C1F] group transition-all"
                          >
                            <div className="flex flex-col">
                              <span className="text-[11px] font-semibold text-slate-750 dark:text-white group-hover:underline">
                                {res.name}
                              </span>
                              <span className="text-[8.5px] font-mono text-slate-400 dark:text-slate-500 uppercase font-black tracking-wider mt-0.5">
                                Type: {res.type}
                              </span>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 group-hover:translate-x-1 transition-transform" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Copilot system study prompt */}
                  <div className="bg-slate-900/50 dark:bg-black/40 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-[9px] font-mono tracking-widest text-[#8E8E93] uppercase font-black flex items-center gap-1.5">
                        <Sparkles className="h-3.8 w-3.8 text-violet-400 animate-pulse" />
                        <span>AI Learning Prompt Template</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedNode.studyPrompt)}
                        className="text-slate-400 hover:text-white transition bg-slate-800 hover:bg-slate-700/80 p-1.5 rounded-lg border border-slate-755 inline-flex items-center gap-1.5"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-[9.5px] font-mono font-black text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span className="text-[9.5px] font-mono font-black">Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-350 dark:text-[#E5E5E7] leading-relaxed select-all italic font-mono bg-black/25 p-3 rounded-xl border border-slate-900/80">
                      "{selectedNode.studyPrompt}"
                    </p>
                    
                    <span className="block text-[8px] text-slate-500 font-mono text-center">
                      📋 Copy prompt to clipboard and run it in the Career Coach module!
                    </span>
                  </div>

                </div>

                <div className="pt-4 border-t border-slate-150 dark:border-slate-850 mt-4 text-center">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-extrabold flex items-center justify-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Selected node: {selectedNode.id} • Double-click node border checkbox to change status</span>
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 dark:border-[#2D2D30] bg-[#F8FAFC]/50 dark:bg-transparent p-12 text-center h-full flex flex-col justify-center items-center">
                <Compass className="h-8 w-8 text-slate-400/80 mb-2.5 animate-spin" />
                <h4 className="font-sans font-bold text-slate-850 dark:text-white text-xs">Awaiting Selection</h4>
                <p className="text-[10px] text-slate-400 dark:text-[#8E8E93] font-medium leading-relaxed max-w-[220px] mt-1">
                  Click on any interactive skill node in the tree to explore tailored learning syllabus paths.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

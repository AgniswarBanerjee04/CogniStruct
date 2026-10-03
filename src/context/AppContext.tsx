import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserProfile,
  SubjectModule,
  MasterPrompt,
  VivaMessage,
  RoadmapNode,
  NavigationTab,
  ModuleId,
  ParsedSyllabusTopic,
} from '../types';
import { hasValidApiKey, getActiveApiKey, saveRuntimeApiKey } from '../services/geminiService';

interface AppContextType {
  isAuthenticated: boolean;
  login: (email: string, rollNumber: string, name?: string) => void;
  logout: () => void;
  user: UserProfile;
  activeModule: SubjectModule;
  activeSubject: string;
  setActiveModuleId: (id: ModuleId) => void;
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  masterPrompts: MasterPrompt[];
  addMasterPrompt: (prompt: MasterPrompt) => void;
  vivaMessages: VivaMessage[];
  setVivaMessages: React.Dispatch<React.SetStateAction<VivaMessage[]>>;
  addVivaMessage: (message: VivaMessage) => void;
  resetVivaChat: (startingTopic?: string) => void;
  roadmapNodes: RoadmapNode[];
  toggleNodeCompletion: (nodeId: string) => void;
  parsedSyllabusTopics: ParsedSyllabusTopic[];
  setParsedSyllabusTopics: React.Dispatch<React.SetStateAction<ParsedSyllabusTopic[]>>;
  toggleParsedTopicCompletion: (topicId: string) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  apiKey: string;
  updateApiKey: (newKey: string) => void;
  hasCustomKey: boolean;
}

const initialModules: SubjectModule[] = [
  {
    id: 'os',
    name: 'Operating Systems',
    code: 'CS-MCA-201',
    semester: 'Semester 2',
    iconName: 'Cpu',
    description: 'Kernel architectures, concurrency, memory paging, and deadlock resolution.',
    totalTopics: 18,
    completedTopics: 14,
    readinessScore: 84,
    accentColor: '#06B6D4',
  },
  {
    id: 'rdbms',
    name: 'Database Management Systems (RDBMS)',
    code: 'CS-MCA-202',
    semester: 'Semester 2',
    iconName: 'Database',
    description: 'Relational algebra, ACID transactions, 3NF/BCNF normalization, and indexing trees.',
    totalTopics: 16,
    completedTopics: 12,
    readinessScore: 78,
    accentColor: '#6366F1',
  },
  {
    id: 'dsa',
    name: 'Python & Data Structures',
    code: 'CS-MCA-203',
    semester: 'Semester 2',
    iconName: 'Code2',
    description: 'Advanced asymptotic analysis, self-balancing trees, graph algorithms, and DP.',
    totalTopics: 20,
    completedTopics: 16,
    readinessScore: 88,
    accentColor: '#10B981',
  },
  {
    id: 'cybersec',
    name: 'Cyber Security',
    code: 'CS-MCA-204',
    semester: 'Semester 2',
    iconName: 'ShieldCheck',
    description: 'Cryptographic primitives, PKI, network packet inspection, and threat modeling.',
    totalTopics: 14,
    completedTopics: 9,
    readinessScore: 72,
    accentColor: '#F59E0B',
  },
];

const initialUser: UserProfile = {
  name: 'Agniswar Banerjee',
  email: 'agniswar.banerjee@msit.edu.in',
  rollNumber: 'MCA-2024-042',
  program: 'Master of Computer Applications (MCA)',
  institution: 'Meghnad Saha Institute of Technology',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  activeModules: initialModules,
  stats: {
    vivaReadinessIndex: 78,
    masterPromptsCount: 14,
    completedSyllabusNodes: 12,
    totalSyllabusNodes: 16,
    academicStreakDays: 12,
  },
};

const initialPrompts: MasterPrompt[] = [
  {
    id: 'prompt-1',
    title: "Peterson's Algorithm Out-of-Order Execution Flaw",
    subject: 'Operating Systems',
    tags: ['Concurrency', 'Memory Barriers', 'Pipelining'],
    createdAt: 'Today, 08:30 AM',
    blocks: {
      role: 'Distinguished Systems Architect & University OS Professor specializing in Linux kernel concurrency.',
      context: 'MCA 2nd Semester candidate at Meghnad Saha Institute of Technology preparing for the end-sem practical viva on process synchronization.',
      task: "Deconstruct Peterson's algorithm step-by-step, mathematically prove mutual exclusion in sequential consistency, then explain why modern speculative out-of-order x86/ARM processors break it without hardware memory fences.",
      format: '1. Formal State Transition Table\n2. C pseudo-code with atomic fences\n3. High-probability viva defense questions with exact model answers.',
    },
    compiledPrompt: `### ROLE:\nDistinguished Systems Architect & University OS Professor specializing in Linux kernel concurrency.\n\n### CONTEXT:\nMCA 2nd Semester candidate at Meghnad Saha Institute of Technology preparing for the end-sem practical viva on process synchronization.\n\n### TASK:\nDeconstruct Peterson's algorithm step-by-step, mathematically prove mutual exclusion in sequential consistency, then explain why modern speculative out-of-order x86/ARM processors break it without hardware memory fences.\n\n### FORMAT:\n1. Formal State Transition Table\n2. C pseudo-code with atomic fences\n3. High-probability viva defense questions with exact model answers.`,
  },
  {
    id: 'prompt-2',
    title: 'B+ Tree vs LSM Trees in Storage Engines',
    subject: 'Database Management Systems (RDBMS)',
    tags: ['Storage Engines', 'B+ Trees', 'LSM-Tree', 'Disk I/O'],
    createdAt: 'Yesterday, 04:15 PM',
    blocks: {
      role: 'Database Kernel Engineer specializing in distributed storage engines and ACID transaction internals.',
      context: 'Postgraduate computer science researcher analyzing write-amplification differences in write-heavy vs read-heavy database workloads.',
      task: 'Compare B+ Trees (in-place updates) with Log-Structured Merge (LSM) Trees (append-only with SSTable compaction) for random write throughput and range query latency.',
      format: 'Technical comparative matrix followed by asymptotic I/O cost formulas and concrete storage architecture diagrams in ASCII.',
    },
    compiledPrompt: `### ROLE:\nDatabase Kernel Engineer specializing in distributed storage engines and ACID transaction internals.\n\n### CONTEXT:\nPostgraduate computer science researcher analyzing write-amplification differences in write-heavy vs read-heavy database workloads.\n\n### TASK:\nCompare B+ Trees (in-place updates) with Log-Structured Merge (LSM) Trees (append-only with SSTable compaction) for random write throughput and range query latency.\n\n### FORMAT:\nTechnical comparative matrix followed by asymptotic I/O cost formulas and concrete storage architecture diagrams in ASCII.`,
  },
];

const initialRoadmap: RoadmapNode[] = [
  {
    id: 'node-1',
    day: 1,
    title: 'CPU Pipelining & Branch Prediction Dynamics',
    subject: 'os',
    description: '5-stage RISC pipeline execution, RAW/WAR data hazards, operand forwarding, and branch target buffer (BTB) mechanics.',
    difficulty: 'Intermediate',
    status: 'completed',
    keyConcepts: ['5-Stage Pipeline', 'Data Hazards', 'Forwarding Bypasses', 'Branch Penalty'],
    expectedVivaQuestions: [
      'What is the mathematical upper bound for speedup in an n-stage pipeline?',
      'How does hardware forwarding resolve Read-After-Write (RAW) data dependencies?',
    ],
    revisionSummary: 'Speedup approaches k as n becomes large. Dynamic 2-bit branch predictors maintain saturating counters in BHT.',
  },
  {
    id: 'node-2',
    day: 2,
    title: 'Process Synchronization & Locking Primitives',
    subject: 'os',
    description: 'Critical Section Problem, Hardware Test-And-Set, Mutex Locks, Counting Semaphores, and Reader-Writer Problem.',
    difficulty: 'Advanced',
    status: 'completed',
    keyConcepts: ['Mutual Exclusion', 'Semaphores', 'Peterson Algorithm', 'Condition Variables'],
    expectedVivaQuestions: [
      'What is the fundamental ownership distinction between a mutex and a binary semaphore?',
      'Why does priority inversion occur, and how does the Priority Ceiling Protocol resolve it?',
    ],
    revisionSummary: 'Mutex enforces thread ownership; semaphores are generalized counters for resource signaling.',
  },
  {
    id: 'node-3',
    day: 3,
    title: 'Deadlock Characterization & Banker’s Algorithm',
    subject: 'os',
    description: 'Coffman four conditions, Resource Allocation Graphs (RAG), Cycle Detection, and Dijkstra’s Banker’s Algorithm safety state.',
    difficulty: 'Intermediate',
    status: 'completed',
    keyConcepts: ['Coffman Conditions', 'RAG Cycle Detection', 'Safe Sequence', 'Need Matrix'],
    expectedVivaQuestions: [
      'Is the presence of a cycle in a Resource Allocation Graph a necessary and sufficient condition for deadlock?',
      'What is the asymptotic time complexity of verifying safe state in Banker’s algorithm with m resource types and n processes?',
    ],
    revisionSummary: 'Cycle is sufficient only for single-unit resource types. Banker safety requires O(m * n^2).',
  },
  {
    id: 'node-4',
    day: 4,
    title: 'Memory Hierarchy & Virtual Paging Engines',
    subject: 'os',
    description: 'TLB translation lookaside buffers, Multi-level Page Tables, Inverted Page Tables, and Page Fault ISR handling sequence.',
    difficulty: 'Advanced',
    status: 'in-progress',
    keyConcepts: ['Page Table Walk', 'TLB Miss Latency', 'Effective Access Time (EAT)', 'Page Fault ISR'],
    expectedVivaQuestions: [
      'Calculate Effective Access Time when TLB hit ratio is 95% with 20ns TLB lookup and 100ns memory latency.',
      'Explain Belady’s Anomaly and identify why LRU is immune while FIFO suffers from it.',
    ],
    revisionSummary: 'LRU satisfies the Inclusion property (Stack Algorithm); FIFO fails it, leading to Belady’s anomaly.',
  },
  {
    id: 'node-5',
    day: 5,
    title: 'Page Replacement Algorithms (LRU, Optimal, Clock)',
    subject: 'os',
    description: 'Second-chance (Clock) algorithm with reference/dirty bits, Optimal Belady MIN replacement, and working-set thrashing prevention.',
    difficulty: 'Intermediate',
    status: 'upcoming',
    keyConcepts: ['Clock Page Replacement', 'Working Set Model', 'Thrashing', 'Dirty Page Writeback'],
    expectedVivaQuestions: [
      'How does the Clock algorithm approximate LRU with low CPU overhead?',
      'What is thrashing, and how do operating systems detect high page-fault frequencies?',
    ],
    revisionSummary: 'Clock replaces page with reference bit 0, clearing bit 1 as pointer sweeps circularly.',
  },
  {
    id: 'node-6',
    day: 6,
    title: 'Disk Scheduling & Journaling File Systems',
    subject: 'os',
    description: 'Elevator SCAN, C-SCAN, C-LOOK algorithms, Inode architecture, Ext4 write-ahead journaling, and crash consistency guarantees.',
    difficulty: 'Fundamental',
    status: 'upcoming',
    keyConcepts: ['C-LOOK Elevator', 'Inode Metadata Blocks', 'WAL Journaling', 'fsck Recovery'],
    expectedVivaQuestions: [
      'Why does C-SCAN provide more uniform cylinder wait times than standard SCAN?',
      'Explain how ext4 ordered-mode journaling prevents metadata corruption after power interruption.',
    ],
    revisionSummary: 'C-SCAN immediately resets to starting track without servicing return requests for starvation freedom.',
  },
];

const initialParsedSyllabus: ParsedSyllabusTopic[] = [
  {
    id: 'topic-os-1',
    topicName: 'Deadlock Handling & Banker’s Safety Algorithm',
    priorityLevel: 'High-Priority',
    actionTrigger: 'Generate Answer',
    keySubtopics: ['Coffman 4 Conditions', 'Resource Allocation Graph Cycles', 'Safety State Vector Calculus'],
    isCompleted: false,
  },
  {
    id: 'topic-os-2',
    topicName: 'Process Synchronization & POSIX Threads (Mutex vs Semaphore)',
    priorityLevel: 'High-Priority',
    actionTrigger: 'Generate Answer',
    keySubtopics: ['pthread_mutex_t Locking', 'Priority Inversion Mitigation', 'Counting Semaphore Primitives'],
    isCompleted: true,
  },
  {
    id: 'topic-os-3',
    topicName: 'Virtual Memory & Multi-Level Page Table Translation',
    priorityLevel: 'High-Priority',
    actionTrigger: 'Generate Answer',
    keySubtopics: ['TLB Hit/Miss EAT Calculations', 'Inverted Page Tables', 'Page Fault ISR Steps'],
    isCompleted: false,
  },
  {
    id: 'topic-os-4',
    topicName: 'CPU Scheduling Algorithms & Context Switch Mechanics',
    priorityLevel: 'Standard',
    actionTrigger: 'Generate Answer',
    keySubtopics: ['Round Robin Time Slicing', 'Multi-Level Feedback Queues', 'PCB Context Save/Restore'],
    isCompleted: true,
  },
  {
    id: 'topic-os-5',
    topicName: 'Page Replacement Algorithms (LRU, Clock & Belady’s Anomaly)',
    priorityLevel: 'High-Priority',
    actionTrigger: 'Generate Answer',
    keySubtopics: ['Second-Chance Clock Sweep', 'Stack Algorithms Proof', 'Working Set Model Thrashing'],
    isCompleted: false,
  },
  {
    id: 'topic-os-6',
    topicName: 'Disk Head Scheduling & Elevator Algorithms (C-LOOK vs SCAN)',
    priorityLevel: 'Standard',
    actionTrigger: 'Generate Answer',
    keySubtopics: ['Track Seek Overhead', 'Starvation Prevention', 'Rotational Latency'],
    isCompleted: false,
  },
  {
    id: 'topic-os-7',
    topicName: 'Unix File System Inode Architecture & Journaling Consistency',
    priorityLevel: 'Elective',
    actionTrigger: 'Generate Answer',
    keySubtopics: ['Direct/Indirect Pointers', 'WAL Journaling', 'Ext4 Crash Recovery'],
    isCompleted: false,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication Gateway state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cognistruct_session_active') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const savedName = localStorage.getItem('cognistruct_user_name');
    const savedEmail = localStorage.getItem('cognistruct_user_email');
    const savedRoll = localStorage.getItem('cognistruct_user_roll');
    return {
      ...initialUser,
      name: savedName || initialUser.name,
      email: savedEmail || initialUser.email,
      rollNumber: savedRoll || initialUser.rollNumber,
    };
  });

  const [activeModule, setActiveModule] = useState<SubjectModule>(initialModules[0]);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [masterPrompts, setMasterPrompts] = useState<MasterPrompt[]>(initialPrompts);
  const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNode[]>(initialRoadmap);
  const [parsedSyllabusTopics, setParsedSyllabusTopics] = useState<ParsedSyllabusTopic[]>(initialParsedSyllabus);

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>(getActiveApiKey());
  const [hasCustomKey, setHasCustomKey] = useState<boolean>(hasValidApiKey());

  // Default starting Viva message
  const [vivaMessages, setVivaMessages] = useState<VivaMessage[]>([
    {
      id: 'init-viva-1',
      sender: 'examiner',
      text: "Welcome to your OS Practical Viva. Let's begin with process synchronization. Can you explain the difference between a mutex and a semaphore?",
      timestamp: 'Just now',
    },
  ]);

  useEffect(() => {
    setHasCustomKey(hasValidApiKey());
  }, [apiKey]);

  const login = (email: string, rollNumber: string, name?: string) => {
    const resolvedName = name?.trim() || initialUser.name;
    localStorage.setItem('cognistruct_session_active', 'true');
    localStorage.setItem('cognistruct_user_email', email);
    localStorage.setItem('cognistruct_user_roll', rollNumber);
    localStorage.setItem('cognistruct_user_name', resolvedName);

    setUser((prev) => ({
      ...prev,
      name: resolvedName,
      email,
      rollNumber,
    }));
    setIsAuthenticated(true);
    setCurrentTab('overview');
  };

  const logout = () => {
    localStorage.removeItem('cognistruct_session_active');
    setIsAuthenticated(false);
  };

  const setActiveModuleId = (id: ModuleId) => {
    const found = user.activeModules.find((m) => m.id === id);
    if (found) {
      setActiveModule(found);
      resetVivaChat(found.name);
    }
  };

  const addMasterPrompt = (newPrompt: MasterPrompt) => {
    setMasterPrompts((prev) => [newPrompt, ...prev]);
    setUser((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        masterPromptsCount: prev.stats.masterPromptsCount + 1,
      },
    }));
  };

  const addVivaMessage = (message: VivaMessage) => {
    setVivaMessages((prev) => [...prev, message]);
  };

  const resetVivaChat = (startingTopic: string = activeModule.name) => {
    setVivaMessages([
      {
        id: `viva-${Date.now()}`,
        sender: 'examiner',
        text: `Welcome to your ${startingTopic} Practical Viva. Let's begin with process synchronization. Can you explain the difference between a mutex and a semaphore?`,
        timestamp: 'Just now',
      },
    ]);
  };

  const toggleNodeCompletion = (nodeId: string) => {
    setRoadmapNodes((prev) => {
      const updated = prev.map((node) => {
        if (node.id === nodeId) {
          const nextStatus: 'completed' | 'in-progress' =
            node.status === 'completed' ? 'in-progress' : 'completed';
          return { ...node, status: nextStatus };
        }
        return node;
      });

      const completedCount = updated.filter((n) => n.status === 'completed').length;
      const readiness = Math.round((completedCount / updated.length) * 100);

      setUser((prevUser) => ({
        ...prevUser,
        stats: {
          ...prevUser.stats,
          completedSyllabusNodes: completedCount,
          vivaReadinessIndex: Math.min(100, Math.max(45, readiness + 10)),
        },
      }));

      return updated;
    });
  };

  const toggleParsedTopicCompletion = (topicId: string) => {
    setParsedSyllabusTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const updateApiKey = (newKey: string) => {
    saveRuntimeApiKey(newKey);
    setApiKey(newKey);
    setHasCustomKey(hasValidApiKey());
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        activeModule,
        activeSubject: activeModule.name,
        setActiveModuleId,
        currentTab,
        setCurrentTab,
        masterPrompts,
        addMasterPrompt,
        vivaMessages,
        setVivaMessages,
        addVivaMessage,
        resetVivaChat,
        roadmapNodes,
        toggleNodeCompletion,
        parsedSyllabusTopics,
        setParsedSyllabusTopics,
        toggleParsedTopicCompletion,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        apiKey,
        updateApiKey,
        hasCustomKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

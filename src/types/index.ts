export type ModuleId = 'os' | 'rdbms' | 'dsa' | 'cybersec';

export interface SubjectModule {
  id: ModuleId;
  name: string;
  code: string;
  semester: string;
  iconName: string;
  description: string;
  totalTopics: number;
  completedTopics: number;
  readinessScore: number;
  accentColor: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  rollNumber?: string;
  program: string;
  institution: string;
  avatarUrl: string;
  activeModules: SubjectModule[];
  stats: {
    vivaReadinessIndex: number; // percentage
    masterPromptsCount: number;
    completedSyllabusNodes: number;
    totalSyllabusNodes: number;
    academicStreakDays: number;
  };
}

export interface RCTFBlocks {
  role: string;
  context: string;
  task: string;
  format: string;
}

export interface MasterPrompt {
  id: string;
  title: string;
  subject: string;
  blocks: RCTFBlocks;
  compiledPrompt: string;
  createdAt: string;
  tags: string[];
}

export interface VivaMessage {
  id: string;
  sender: 'examiner' | 'student';
  text: string;
  timestamp: string;
  evaluation?: VivaEvaluation;
}

export interface VivaEvaluation {
  accuracyScore: number; // out of 10
  depthScore: number; // out of 10
  confidenceScore: number; // out of 10
  overallScore: number; // out of 10
  strengths: string[];
  weaknesses: string[];
  examinerCritique: string;
  suggestedRevision: string;
}

export interface RoadmapNode {
  id: string;
  day: number;
  title: string;
  subject: ModuleId;
  description: string;
  difficulty: 'Fundamental' | 'Intermediate' | 'Advanced';
  status: 'completed' | 'in-progress' | 'upcoming';
  keyConcepts: string[];
  expectedVivaQuestions: string[];
  revisionSummary: string;
}

export interface ParsedSyllabusTopic {
  id: string;
  topicName: string;
  priorityLevel: 'High-Priority' | 'Standard' | 'Elective';
  actionTrigger: string; // e.g. "Generate Answer" / "Study Link"
  keySubtopics?: string[];
  explanation?: string;
  isCompleted?: boolean;
}

export type NavigationTab = 'overview' | 'rctf' | 'viva' | 'roadmap' | 'syllabus';

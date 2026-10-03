import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VivaEvaluation, ParsedSyllabusTopic } from '../types';

// Retrieve active API key either from environment or local storage override
export const getActiveApiKey = (): string => {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() !== '' && envKey !== 'your_gemini_api_key_here') {
    return envKey.trim();
  }
  const localKey = localStorage.getItem('cognistruct_gemini_api_key');
  if (localKey && localKey.trim() !== '') {
    return localKey.trim();
  }
  return '';
};

export const hasValidApiKey = (): boolean => {
  const key = getActiveApiKey();
  return Boolean(key && key.length > 5);
};

export const saveRuntimeApiKey = (key: string): void => {
  if (!key) {
    localStorage.removeItem('cognistruct_gemini_api_key');
  } else {
    localStorage.setItem('cognistruct_gemini_api_key', key.trim());
  }
};

/**
 * Helper to parse JSON from Gemini's response, handling markdown fences and raw text
 */
function extractJsonFromText<T>(text: string): T {
  let cleaned = text.trim();
  // Strip ```json or ``` markdown wrapper if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  // Attempt direct JSON parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // If there's surrounding text, attempt to isolate the first JSON object or array
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidateObj = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(candidateObj);
    }

    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      const candidateArr = cleaned.substring(firstBracket, lastBracket + 1);
      return JSON.parse(candidateArr);
    }

    throw new Error('Unable to parse JSON from AI response: ' + text.substring(0, 150));
  }
}

/**
 * Direct Gemini API call helper using official GoogleGenerativeAI SDK with gemini-1.5-flash
 */
async function callGeminiApi(prompt: string, jsonMode: boolean = false): Promise<string> {
  const apiKey = getActiveApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2500,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) {
      throw new Error('Empty response received from Gemini.');
    }
    return text;
  } catch (err: any) {
    const msg = err?.message || 'Gemini API call failed';
    throw new Error(`Gemini API Error: ${msg}`);
  }
}

/**
 * Executes an arbitrary prompt with Gemini API
 */
export async function executePromptWithGemini(prompt: string): Promise<string> {
  return await callGeminiApi(prompt, false);
}

/**
 * Generates an opening Viva question tailored specifically to the active subject
 */
export async function generateInitialVivaQuestion(activeSubject: string): Promise<string> {
  const prompt = `You are a strict university examiner for an advanced Computer Science & Engineering program. The current subject is "${activeSubject}".
Pose an initial, rigorous opening oral viva voce question to the student candidate on a foundational yet critical architectural or conceptual topic in "${activeSubject}".
Keep your response concise and professional (2-3 sentences max).
Include a brief, formal welcome ("Welcome to your ${activeSubject} Practical Viva Voce.") followed directly by your opening technical question.`;

  try {
    return await callGeminiApi(prompt, false);
  } catch {
    const subjectOpeners: Record<string, string> = {
      'Operating Systems':
        "Welcome to your Operating Systems Practical Viva Voce. Let's begin with process concurrency: can you explain the critical differences between a mutex and a counting semaphore, and explain how priority inversion is mitigated in real-time kernels?",
      'Database Management Systems (RDBMS)':
        "Welcome to your Database Management Systems (RDBMS) Practical Viva Voce. Let's begin with normalization and transaction control: can you explain why Boyce-Codd Normal Form (BCNF) is strictly stronger than 3NF, and explain how the Write-Ahead Logging (WAL) protocol guarantees Atomicity and Durability?",
      'Python & Data Structures':
        "Welcome to your Python & Data Structures Practical Viva Voce. Let's begin with algorithmic efficiency: can you explain the worst-case asymptotic bounds of a Red-Black Tree vs an AVL Tree, and describe how Python implements dynamic array over-allocation in list objects?",
      'Cyber Security':
        "Welcome to your Cyber Security Practical Viva Voce. Let's begin with modern asymmetric cryptography: can you explain the mathematical trapdoor function underpinning RSA encryption, and how digital signatures enforce non-repudiation and integrity?",
    };
    return (
      subjectOpeners[activeSubject] ||
      `Welcome to your ${activeSubject} Practical Viva Voce. Let's begin: explain the core architectural principles and foundational mechanisms of ${activeSubject}.`
    );
  }
}

/**
 * Evaluates viva voce student answer strictly using live Gemini API.
 * Injects the exact required strict system prompt.
 */
export async function evaluateStudentVivaAnswer(
  question: string,
  studentAnswer: string,
  activeSubject: string
): Promise<{ examinerReply: string; evaluation: VivaEvaluation }> {
  // Required strict system prompt
  const strictSystemPrompt = `You are a strict university examiner for an advanced Computer Science & Engineering program. The current subject is ${activeSubject}. You must dynamically evaluate the user's exact input. If the user says 'I don't know' or asks for the answer, you MUST provide the complete, correct technical answer clearly and comprehensively before asking the next follow-up question. Never praise an incorrect or blank answer. Ensure absolute strictness in subject domains (e.g., if testing Operating Systems, do not mix in Python or general programming questions; if testing Java, focus on core Java language concepts as requested by the user, rather than general OOP theory).`;

  const prompt = `${strictSystemPrompt}

EXAMINATION DETAILS:
- Subject: ${activeSubject}
- Current Examiner Question: "${question}"
- Student's Live Oral Response: "${studentAnswer}"

CRITICAL MANDATE:
If the candidate states "I don't know", is unsure, asks for the answer, or provides an incorrect or blank response, you MUST provide the complete, correct technical answer clearly and comprehensively in "examinerReply" before asking your next follow-up question. Never praise an incorrect or blank answer.

Evaluate the student's exact response rigorously as a senior external university examiner.
Return a STRICTLY VALID JSON object with the following schema:
{
  "examinerReply": "Your verbal reply to the candidate. Critique their specific answer accurately. If the user says 'I don't know' or asks for the answer, you MUST provide the complete, correct technical answer clearly and comprehensively before asking the next follow-up question. Never praise an incorrect or blank answer.",
  "accuracyScore": 7.5,
  "depthScore": 6.8,
  "confidenceScore": 8.0,
  "overallScore": 7.4,
  "strengths": [
    "Specific strength from candidate's exact answer or recognition of concept"
  ],
  "weaknesses": [
    "Specific gap, omission, or lack of knowledge in candidate's response"
  ],
  "examinerCritique": "2-sentence formal evaluation note for the university viva record.",
  "suggestedRevision": "Specific revision focus area before the next question."
}
Only return the JSON object. All scores must be numbers between 1.0 and 10.0. If the candidate said 'I don't know', assign lower scores (1.0 to 3.5) and fully explain the solution.`;

  try {
    const rawResult = await callGeminiApi(prompt, true);
    const parsed = extractJsonFromText<{
      examinerReply: string;
      accuracyScore: number;
      depthScore: number;
      confidenceScore: number;
      overallScore: number;
      strengths: string[];
      weaknesses: string[];
      examinerCritique: string;
      suggestedRevision: string;
    }>(rawResult);

    return {
      examinerReply:
        parsed.examinerReply ||
        'Understood. Let me clarify the technical solution: ' +
          question +
          ' Now, for your next question: explain the practical application of this concept.',
      evaluation: {
        accuracyScore: Number(parsed.accuracyScore) || 4.0,
        depthScore: Number(parsed.depthScore) || 4.0,
        confidenceScore: Number(parsed.confidenceScore) || 4.0,
        overallScore: Number(parsed.overallScore) || 4.0,
        strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0
          ? parsed.strengths
          : ['Demonstrated willingness to acknowledge knowledge boundaries'],
        weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0
          ? parsed.weaknesses
          : ['Needs review of core technical definitions'],
        examinerCritique: parsed.examinerCritique || 'Candidate evaluated under strict university Computer Science grading criteria.',
        suggestedRevision: parsed.suggestedRevision || 'Review core definitions and architectural trade-offs.',
      },
    };
  } catch (err: any) {
    if (err.message === 'MISSING_API_KEY') {
      throw new Error('MISSING_API_KEY');
    }
    // High-fidelity fallback when candidate says "I don't know" or API is temporarily unreachable
    const isIdk =
      studentAnswer.toLowerCase().includes("don't know") ||
      studentAnswer.toLowerCase().includes('dont know') ||
      studentAnswer.toLowerCase().includes('no idea') ||
      studentAnswer.toLowerCase().includes('tell me') ||
      studentAnswer.toLowerCase().includes('what is the answer') ||
      studentAnswer.length < 5;

    if (isIdk) {
      return {
        examinerReply: `Since you stated you do not know, here is the complete technical explanation: In ${activeSubject}, regarding "${question}"—the fundamental mechanism requires strict adherence to core architectural invariants. For instance, in concurrency and process synchronization, mutexes enforce exclusive single-thread ownership via binary state flags, whereas counting semaphores maintain an integer counter to regulate shared access across multiple concurrent threads through atomic wait() and signal() operations.\n\nNow, let us proceed to your next question: Can you explain how deadlocks are formally characterized and prevented in this context?`,
        evaluation: {
          accuracyScore: 2.0,
          depthScore: 1.5,
          confidenceScore: 3.0,
          overallScore: 2.2,
          strengths: ['Honest acknowledgment of conceptual knowledge boundary'],
          weaknesses: ['Failed to articulate technical definition and core operational primitives'],
          examinerCritique: 'Candidate was unable to state the mechanism. The examiner provided the complete technical answer before posing the follow-up question.',
          suggestedRevision: `Review fundamental ${activeSubject} definitions and key operational mechanisms.`,
        },
      };
    }

    throw err;
  }
}

/**
 * Intelligent Syllabus Parser using Gemini API.
 * Uses the requested prompt format:
 * "Analyze this university syllabus. 1. Extract the core topics. 2. Flag the 'High-Priority/High-Weightage' topics (e.g., Deadlock Handling in OS, BCNF Normalization in RDBMS, POSIX threads). 3. Return a JSON array containing the topic name, priority level, and a generated 'Study Link' or 'Generate Answer' action trigger."
 */
export async function parseSyllabusWithGemini(
  syllabusText: string,
  subject: string
): Promise<ParsedSyllabusTopic[]> {
  const prompt = `Analyze this university syllabus for ${subject}. 
1. Extract the core topics. 
2. Flag the 'High-Priority/High-Weightage' topics (e.g., Deadlock Handling in OS, BCNF Normalization in RDBMS, POSIX threads). 
3. Return a JSON array containing the topic name, priority level, and a generated 'Study Link' or 'Generate Answer' action trigger.

SYLLABUS CONTENT:
"""
${syllabusText}
"""

Format your response as a valid JSON array of objects adhering strictly to this schema:
[
  {
    "id": "topic-1",
    "topicName": "Name of the technical topic",
    "priorityLevel": "High-Priority" | "Standard" | "Elective",
    "actionTrigger": "Generate Answer",
    "keySubtopics": ["Subtopic 1", "Subtopic 2"]
  }
]
Extract at least 6 to 10 prominent topics. Ensure high-weightage core exam/viva topics are tagged with "High-Priority".
`;

  const rawResult = await callGeminiApi(prompt, true);
  const parsed = extractJsonFromText<any[]>(rawResult);

  if (!Array.isArray(parsed)) {
    throw new Error('Expected JSON array of syllabus topics from Gemini.');
  }

  return parsed.map((item, index) => ({
    id: item.id || `parsed-${Date.now()}-${index}`,
    topicName: item.topicName || item.name || `Topic ${index + 1}`,
    priorityLevel:
      item.priorityLevel === 'High-Priority' || item.priorityLevel === 'high'
        ? 'High-Priority'
        : item.priorityLevel === 'Elective'
        ? 'Elective'
        : 'Standard',
    actionTrigger: item.actionTrigger || 'Generate Answer',
    keySubtopics: Array.isArray(item.keySubtopics) ? item.keySubtopics : [],
    isCompleted: false,
  }));
}

/**
 * Generates an in-depth AI technical explanation for a specific syllabus topic
 */
export async function generateTopicTechnicalBreakdown(
  topicName: string,
  subject: string
): Promise<string> {
  const prompt = `You are a distinguished university professor for a Computer Science & Engineering program.
Provide an exhaustive, high-level technical breakdown for the syllabus topic: "${topicName}" in the subject "${subject}".

Structure your explanation strictly with the following sections:
1. Executive Conceptual Essence (What it is, architectural rationale, why it exists)
2. Rigorous Theoretical & Mathematical Foundation (Invariants, formal guarantees, state machines or proof sketch)
3. Concrete Technical Implementation or Pseudocode (Annotated, production-grade or POSIX-compliant)
4. Common University Exam & Viva Traps (Top 3 questions external examiners ask and exact model responses)
5. Time / Space Complexity & Practical Limitations

Use clean GitHub Markdown with code blocks and bullet points.`;

  return await callGeminiApi(prompt, false);
}

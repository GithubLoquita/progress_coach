/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  notes?: string;
  resources?: string;
  lastStudied?: string;
}

export interface Subject {
  id: string;
  title: string;
  category: 'PRELIMS' | 'MAINS' | 'OPTIONAL';
  iconName: string;
  chaptersCount: number;
  completedChapters: number;
}

export interface DailyTask {
  id: string;
  title: string;
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "10:00"
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'COMPLETED' | 'PENDING' | 'MISSED';
  subjectId?: string;
  recurring: boolean;
}

export interface RevisionItem {
  id: string;
  title: string;
  subjectId: string;
  intervalDays: 1 | 7 | 21;
  dueDate: string; // YYYY-MM-DD
  status: 'PENDING' | 'DONE';
  lastRevised?: string;
}

export interface MockTest {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  score: number; // e.g. 124.5
  totalMarks: number; // usually 200 for Pre, 100/200 for Mains
  accuracy: number; // percentage, e.g. 82
  weakAreas: string[];
  analysisNotes: string;
}

export interface CurrentAffairsItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  content: string;
  category: 'polity' | 'economy' | 'environment' | 'national' | 'international' | 'west-bengal';
  tags: string[];
}

export interface StudyNote {
  id: string;
  title: string;
  subjectId: string;
  content: string;
  createdAt: string;
  tags: string[];
  isPinned: boolean;
  isBookmarked: boolean;
}

export interface InterviewProfile {
  name: string;
  hobbies: string;
  district: string;
  academicBackground: string;
  optionalSubject: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answerDraft: string;
  category: 'HR' | 'CURRENT_AFFAIRS' | 'DISTRICT' | 'ACADEMIC' | 'OPTIONAL' | 'SITUATIONAL';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MockFeedback {
  id: string;
  date: string;
  panelMessage: string;
  score: number; // e.g. 150 out of 200
  positivePoints: string[];
  improvementPoints: string[];
}

export interface StudyLog {
  date: string; // YYYY-MM-DD
  hours: number;
  tasksCompleted: number;
  activeStreak: number;
}

export interface Reminder {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'REVISION' | 'MOCK' | 'BACKLOG' | 'TARGET' | 'MILESTONE';
  isCompleted: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

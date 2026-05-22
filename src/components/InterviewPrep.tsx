/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  Award, 
  Plus, 
  HelpCircle, 
  MessageSquare, 
  Flame, 
  CheckCircle2, 
  PenTool, 
  Map, 
  Search, 
  AlertCircle,
  Sparkles,
  RefreshCw,
  ThumbsUp,
  Sliders
} from 'lucide-react';
import { InterviewQuestion, MockFeedback, InterviewProfile } from '../types';

interface InterviewPrepProps {
  questions: InterviewQuestion[];
  feedbacks: MockFeedback[];
  profile: InterviewProfile;
  onUpdateQuestion: (id: string, updates: Partial<InterviewQuestion>) => void;
  onAddQuestion: (question: Omit<InterviewQuestion, 'id'>) => void;
  onUpdateProfile: (profile: InterviewProfile) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function InterviewPrep({
  questions,
  feedbacks,
  profile,
  onUpdateQuestion,
  onAddQuestion,
  onUpdateProfile,
  onAddToast
}: InterviewPrepProps) {
  const [activeTab, setActiveTab] = useState<'BANK' | 'PROFILE' | 'FEEDBACK'>('BANK');
  const [newQuestionStr, setNewQuestionStr] = useState('');
  const [newCategory, setNewCategory] = useState<InterviewQuestion['category']>('HR');
  const [searchQuery, setSearchQuery] = useState('');

  // Active profile local editing fields
  const [pName, setPName] = useState(profile.name);
  const [pDistrict, setPDistrict] = useState(profile.district);
  const [pAcademic, setPAcademic] = useState(profile.academicBackground);
  const [pOptional, setPOptional] = useState(profile.optionalSubject);
  const [pHobbies, setPHobbies] = useState(profile.hobbies);

  // Active question being answered
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(questions[0]?.id || null);
  const [tempAnswerDraft, setTempAnswerDraft] = useState('');

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: pName,
      district: pDistrict,
      academicBackground: pAcademic,
      optionalSubject: pOptional,
      hobbies: pHobbies
    });
    onAddToast('Personality profile parameters updated', 'success');
  };

  const handleSaveAnswerDraft = () => {
    if (!activeQuestionId) return;
    onUpdateQuestion(activeQuestionId, { answerDraft: tempAnswerDraft });
    onAddToast('Persona draft response saved', 'success');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionStr.trim()) return;

    onAddQuestion({
      question: newQuestionStr.trim(),
      answerDraft: '',
      category: newCategory,
      confidence: 'LOW'
    });

    setNewQuestionStr('');
    onAddToast('New interview question indexed', 'success');
  };

  const filteredQuestions = questions.filter(q => {
    const matchesQuery = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.answerDraft.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">WBCS Personality Test preparatory cabinet</h2>
          <p className="text-xs text-gray-550">Formulate your profile-specific response matrix, outline district answers, and examine mock panel feedback logs.</p>
        </div>

        {/* Tab options selector */}
        <div className="flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('BANK')}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
              activeTab === 'BANK' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Question Bank
          </button>
          
          <button
            onClick={() => {
              setActiveTab('PROFILE');
              setPName(profile.name);
              setPDistrict(profile.district);
              setPAcademic(profile.academicBackground);
              setPOptional(profile.optionalSubject);
              setPHobbies(profile.hobbies);
            }}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
              activeTab === 'PROFILE' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            My Profile
          </button>

          <button
            onClick={() => setActiveTab('FEEDBACK')}
            className={`rounded-full px-3.5 py-1 text-xs font-bold transition ${
              activeTab === 'FEEDBACK' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Mock Logs ({feedbacks.length})
          </button>
        </div>
      </div>

      {/* Main active layout rendering */}
      {activeTab === 'BANK' && (
        <div className="grid gap-6 md:grid-cols-5">
          {/* List of Panel Questions */}
          <div className="md:col-span-2 space-y-3 max-h-[580px] overflow-y-auto pr-1">
            <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3.5 py-1.5 border border-slate-150">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search QA list..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-gray-850 outline-none w-full"
              />
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Questions Bank</p>
            
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-10 text-xs text-gray-400">No matching questions indexed.</div>
            ) : (
              filteredQuestions.map((q) => {
                const isActive = q.id === activeQuestionId;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionId(q.id);
                      setTempAnswerDraft(q.answerDraft);
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                      isActive 
                        ? 'bg-blue-50/50 border-blue-200' 
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        q.category === 'SITUATIONAL' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                        q.category === 'DISTRICT' ? 'bg-emerald-55 bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        q.category === 'HR' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {q.category}
                      </span>

                      <span className={`text-[8px] font-bold rounded-full px-1.5 py-0.5 ${
                        q.confidence === 'HIGH' ? 'bg-emerald-100 text-emerald-800' :
                        q.confidence === 'MEDIUM' ? 'bg-amber-105 bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700 font-bold animate-pulse'
                      }`}>
                        {q.confidence} CONF
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
                      {q.question}
                    </h4>
                    {q.answerDraft && (
                      <p className="text-[10px] text-gray-400 italic mt-1.5 line-clamp-1">✔ Draft prepared</p>
                    )}
                  </div>
                )
              })
            )}

            {/* Quick user question input builder */}
            <form onSubmit={handleCreateQuestion} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Index custom commission question</span>
              <textarea
                rows={2}
                placeholder="Write possible personality question..."
                value={newQuestionStr}
                onChange={(e) => setNewQuestionStr(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-gray-200 bg-white"
                required
              />
              <div className="flex justify-between items-center">
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="text-[10px] p-1 border rounded bg-white"
                >
                  <option value="HR">HR</option>
                  <option value="CURRENT_AFFAIRS">Current Affairs</option>
                  <option value="DISTRICT">WB District Spec</option>
                  <option value="OPTIONAL">Optional Subject</option>
                  <option value="SITUATIONAL">Situational Case</option>
                </select>
                
                <button type="submit" className="text-[10px] text-white bg-blue-600 px-3 py-1 rounded-full font-bold">
                  Add +
                </button>
              </div>
            </form>
          </div>

          {/* Answer Editor Workspace Panel */}
          <div className="md:col-span-3 rounded-3xl bg-white p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
            {activeQuestion ? (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider block">Target Panel Question Detail</span>
                  <h3 className="text-sm font-bold text-gray-900 leading-normal mt-1">"{activeQuestion.question}"</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                      <PenTool className="h-4 w-4" /> Prepare your draft response (Bullet points or narrative)
                    </span>
                    
                    {/* Confidence toggles */}
                    <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-full border border-slate-200">
                      {(['LOW', 'MEDIUM', 'HIGH'] as const).map(conf => (
                        <button
                          key={conf}
                          onClick={() => {
                            onUpdateQuestion(activeQuestion.id, { confidence: conf });
                            onAddToast(`Confidence set to ${conf}`, 'info');
                          }}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black transition ${
                            activeQuestion.confidence === conf ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {conf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={8}
                    placeholder="Brief introduction blueprint..."
                    value={tempAnswerDraft}
                    onChange={(e) => setTempAnswerDraft(e.target.value)}
                    className="w-full text-xs p-3.5 border border-gray-2.5 rounded-2xl bg-slate-50/50 focus:outline-blue-500 font-sans"
                  />
                </div>

                <div className="rounded-2xl bg-blue-50/30 border border-blue-100 p-4.5 text-xs text-blue-800 space-y-1">
                  <span className="font-extrabold flex items-center gap-1">📖 Coach Response advice</span>
                  <p className="text-blue-700 leading-relaxed">
                    Always formulate answers using the "STAR" framework (Situation, Task, Action, Result). Support administrative points using official West Bengal statistical details.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center py-20 text-xs text-gray-400 italic">No commission questions active. Select one on the left.</p>
            )}

            {activeQuestion && (
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">Response parameters: ~200-300 words recommended.</span>
                <button
                  type="button"
                  onClick={handleSaveAnswerDraft}
                  className="rounded-xl bg-blue-600 text-white font-black text-xs px-5 py-2 hover:bg-blue-700 transition"
                >
                  Save response draft
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editing Personality Profile Parameters form */}
      {activeTab === 'PROFILE' && (
        <form onSubmit={handleUpdateProfileSubmit} className="rounded-3xl bg-white border border-gray-100 p-6 shadow-xs max-w-2xl mx-auto space-y-5">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Configure Candidate Personal Profile Spec</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Aspirant Name</label>
              <input
                type="text"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 bg-slate-50/50 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Native West Bengal District</label>
              <input
                type="text"
                value={pDistrict}
                onChange={(e) => setPDistrict(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 bg-slate-50/50 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Academic Background / Graduation stream</label>
              <input
                type="text"
                value={pAcademic}
                onChange={(e) => setPAcademic(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 bg-slate-50/50 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Selected WBCS Optional Subject</label>
              <input
                type="text"
                value={pOptional}
                onChange={(e) => setPOptional(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 bg-slate-50/50 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase">Hobbies & Extracurricular activities</label>
            <textarea
              rows={3}
              value={pHobbies}
              onChange={(e) => setPHobbies(e.target.value)}
              className="w-full text-xs p-3 border border-gray-200 bg-slate-50/50 rounded-xl"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 text-white font-black text-xs px-6 py-3 hover:bg-blue-700 transition"
            >
              Update Profile details
            </button>
          </div>
        </form>
      )}

      {/* Mock Review Logs */}
      {activeTab === 'FEEDBACK' && (
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Historic Mock Board evaluations</p>
          
          {feedbacks.map((f) => (
            <div key={f.id} className="rounded-3xl border border-gray-100 bg-white p-6 space-y-4 shadow-xs">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center sm:flex-row flex-col gap-2">
                <div>
                  <h4 className="text-xs font-black text-gray-950 flex items-center gap-1.5">
                    <Award className="h-4.5 w-4.5 text-yellow-500" /> evaluative Feedback Report
                  </h4>
                  <span className="text-[10px] text-gray-400">Conducted on {f.date}</span>
                </div>

                <span className="rounded-full bg-blue-50 text-blue-800 text-[10px] font-extrabold px-3 py-1">
                  Evaluated Marks: {f.score} / 200
                </span>
              </div>

              <p className="text-xs italic text-gray-650 bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{f.panelMessage}"
              </p>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Positive Highlights</span>
                  <ul className="space-y-1.5 pl-2.5">
                    {f.positivePoints.map((point, i) => (
                      <li key={i} className="list-disc text-[11px] text-emerald-900 leading-snug">{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider block">Areas to Revise & Calibrate</span>
                  <ul className="space-y-1.5 pl-2.5">
                    {f.improvementPoints.map((point, i) => (
                      <li key={i} className="list-disc text-[11px] text-rose-900 leading-snug">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

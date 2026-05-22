/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  Award, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Compass, 
  HelpCircle,
  TrendingDown,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { MockTest } from '../types';

interface MockTrackerProps {
  mocks: MockTest[];
  onAddMock: (mock: Omit<MockTest, 'id'>) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function MockTracker({
  mocks,
  onAddMock,
  onAddToast
}: MockTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState(115);
  const [totalMarks, setTotalMarks] = useState(200);
  const [accuracy, setAccuracy] = useState(80);
  const [weakAreasStr, setWeakAreasStr] = useState('');
  const [analysisNotes, setAnalysisNotes] = useState('');

  const handleCreateMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onAddToast('Please specify a valid test name', 'warning');
      return;
    }

    const weakAreas = weakAreasStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

    onAddMock({
      name: name.trim(),
      date,
      score: Number(score),
      totalMarks: Number(totalMarks),
      accuracy: Number(accuracy),
      weakAreas,
      analysisNotes: analysisNotes.trim()
    });

    setName('');
    setErrorBlankStates();
    setShowAddForm(false);
    onAddToast('New mock exam result recorded in analytics database', 'success');
  };

  const setErrorBlankStates = () => {
    setWeakAreasStr('');
    setAnalysisNotes('');
  };

  // Calculations for KPI Cards
  const mockCount = mocks.length;
  const averageScore = mockCount > 0 ? (mocks.reduce((acc, m) => acc + m.score, 0) / mockCount).toFixed(1) : '0';
  const averageAccuracy = mockCount > 0 ? Math.round(mocks.reduce((acc, m) => acc + m.accuracy, 0) / mockCount) : 0;
  const highestScoreObj = mocks.reduce((max, m) => m.score > max.score ? m : max, mocks[0] || { score: 0 });
  const highestScore = highestScoreObj ? highestScoreObj.score : 0;

  // Render high-fidelity SVG trend line chart
  const sortedMocks = [...mocks].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Chart dimensions
  const chartWidth = 560;
  const chartHeight = 180;
  const padding = 30;

  // Calculate coordinates for SVG
  const generateChartPoints = () => {
    if (sortedMocks.length < 2) return '';
    const minX = 0;
    const maxX = sortedMocks.length - 1;
    // Score limits (e.g. 0 to 200, or minScore to maxScore)
    const minScore = 60; // cut-off reference lower
    const maxScore = 150; 

    return sortedMocks.map((m, idx) => {
      const x = padding + (idx / maxX) * (chartWidth - 2 * padding);
      // Clamp score to limits for rendering safely
      const clampedScore = Math.max(minScore, Math.min(maxScore, m.score));
      const y = chartHeight - padding - ((clampedScore - minScore) / (maxScore - minScore)) * (chartHeight - 2 * padding);
      return { x, y, score: m.score, name: m.name, accuracy: m.accuracy };
    });
  };

  const chartPoints = generateChartPoints();
  const pathData = typeof chartPoints === 'object' && chartPoints.length > 1 
    ? chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Mock Test Performance & Cutoff Analytics</h2>
          <p className="text-xs text-gray-500">Record mock results, track score trends, and map weak syllabus areas for immediate remediation.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 self-start rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Record Mock Result</span>
        </button>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wide block">Mocks attempted</span>
          <span className="text-2xl font-black text-gray-900">{mockCount}</span>
          <span className="text-[10px] text-gray-400 mt-1 block">Full-length & Sectionals</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wide block">Average Score</span>
          <span className="text-2xl font-black text-slate-800">{averageScore} <span className="text-xs text-gray-400">/200</span></span>
          <span className="text-[10px] text-blue-600 mt-1 block">Target threshold: 125+ for cutoff security</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wide block">Avg Accuracy</span>
          <span className="text-2xl font-black text-emerald-600">{averageAccuracy}%</span>
          <span className="text-[10px] text-emerald-650 mt-1 block">Ideal accuracy range: &gt;80%</span>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wide block">Peak Score Achieved</span>
          <span className="text-2xl font-black text-indigo-600">{highestScore} <span className="text-xs text-gray-400">/200</span></span>
          <span className="text-[10px] text-indigo-550 mt-1 block">Secure Group A potential</span>
        </div>
      </div>

      {/* Adding mock form */}
      {showAddForm && (
        <form onSubmit={handleCreateMock} className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-700">Enter Mock Exam analytical parameters</h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 text-lg hover:text-slate-600">&times;</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Mock Exam Name / Series code</label>
              <input
                type="text"
                placeholder="e.g. WBCS Prelims Full Length Mock 4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Date of Exam</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Score Obtained</label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="200"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Accuracy rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={accuracy}
                onChange={(e) => setAccuracy(Number(e.target.value))}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Weak syllabus areas (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Modern Physics, G-G Acts timeline"
                value={weakAreasStr}
                onChange={(e) => setWeakAreasStr(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Analytical post-exam notes (Errors, improvements, targets)</label>
            <textarea
              rows={3}
              placeholder="Lost 15 marks in negative marking. Should avoid guesses in General Science. History timeline matches expectation."
              value={analysisNotes}
              onChange={(e) => setAnalysisNotes(e.target.value)}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs font-bold px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs font-black px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Record Exam Result
            </button>
          </div>
        </form>
      )}

      {/* Main Analysis and chart layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* SVG Trend Map */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
              <span>Score progression over time (Cut-off Cutline: 120 marks)</span>
            </h3>
            <span className="text-[10px] font-bold text-gray-400">Total Scores Line</span>
          </div>

          {/* Inline SVG Chart */}
          {sortedMocks.length < 2 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              Record at least 2 mock tests to chart progress curves.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-full overflow-x-auto scrollbar-none">
                <svg width={chartWidth} height={chartHeight} className="mx-auto block">
                  {/* Grid Lines */}
                  <line x1={padding} y1={padding} x2={chartWidth-padding} y2={padding} stroke="#f3f4f6" strokeWidth="1" />
                  <line x1={padding} y1={chartHeight/2} x2={chartWidth-padding} y2={chartHeight/2} stroke="#f3f4f6" strokeWidth="1" />
                  <line x1={padding} y1={chartHeight-padding} x2={chartWidth-padding} y2={chartHeight-padding} stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Reference Cut-off Line (at 120 marks equivalent y coordinate) */}
                  {/* Formula: y = H - p - ((clamped - 60)/(150-60))*(H-2p) => for score 120, pct = (120-60)/90 = 60/90 = 2/3 */}
                  <line 
                    x1={padding} 
                    y1={chartHeight - padding - (2/3 * (chartHeight - 2 * padding))} 
                    x2={chartWidth-padding} 
                    y2={chartHeight - padding - (2/3 * (chartHeight - 2 * padding))} 
                    stroke="#ec4899" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={chartWidth - padding - 80} 
                    y={chartHeight - padding - (2/3 * (chartHeight - 2 * padding)) - 4} 
                    className="text-[9px] font-extrabold fill-pink-500 uppercase tracking-widest"
                  >
                    cutoff threshold (120)
                  </text>

                  {/* Core Data Path Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Points dots and simple callouts */}
                  {Array.isArray(chartPoints) && chartPoints.map((point, index) => (
                    <g key={index} className="group/dot cursor-pointer">
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="5"
                        className="fill-blue-600 stroke-white cursor-pointer"
                        strokeWidth="2"
                      />
                      {/* Simple static labels above point dots */}
                      <text
                        x={point.x}
                        y={point.y - 10}
                        textAnchor="middle"
                        className="text-[10px] font-black fill-slate-800 bg-white"
                      >
                        {point.score}
                      </text>
                      {/* Sub-label showing test index on x-axis */}
                      <text
                        x={point.x}
                        y={chartHeight - 10}
                        textAnchor="middle"
                        className="text-[8px] font-bold fill-slate-400"
                      >
                        Test {index + 1}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <p className="text-[10px] text-gray-400 text-center">X-axis represents Tests chronological. Y-axis represents score (capped window: 60 - 150 marks).</p>
            </div>
          )}
        </div>

        {/* Action point / Weak Syllabus sectors remediation */}
        <div className="rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
              <Compass className="h-4.5 w-4.5 text-rose-500" />
              <span>Priority Weak syllabus Sectors</span>
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-gray-600 leading-normal">
              Based on errors logged in your latest mock tests, prioritize re-studying these topics immediately:
            </p>

            <div className="flex flex-wrap gap-2">
              {mocks.flatMap(m => m.weakAreas).filter((value, index, self) => self.indexOf(value) === index).slice(0, 8).map((area, idx) => (
                <span 
                  key={idx}
                  className="rounded-full bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1 text-xs font-semibold"
                >
                  ⚠ {area}
                </span>
              ))}
            </div>

            <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-100 text-xs">
              <span className="font-extrabold text-amber-900 block mb-1">💡 Preparation Tip</span>
              Study at least 2 key source book chapters for each weak sector before attempting the next sectional weekly paper.
            </div>
          </div>
        </div>
      </div>

      {/* List of Mock reports detail folddowns */}
      <div className="space-y-3.5">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Detailed Test Reports</p>
        
        {sortedMocks.reverse().map((mock) => (
          <div key={mock.id} className="rounded-3xl border border-gray-100 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-50 pb-3">
              <div>
                <h4 className="text-xs font-black text-gray-900 flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-yellow-500 shrink-0" />
                  <span>{mock.name}</span>
                </h4>
                <p className="text-[10px] text-gray-450 mt-0.5">Attempted on: {mock.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 text-blue-800 text-[10px] font-extrabold px-3 py-1">
                  Score: {mock.score} / {mock.totalMarks}
                </span>
                
                <span className={`rounded-full text-[10px] font-extrabold px-3 py-1 ${
                  mock.accuracy > 80 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                }`}>
                  Accuracy: {mock.accuracy}%
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-xs leading-normal">
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">Mock analysis & Review Note</span>
                <p className="text-slate-650 bg-slate-50/30 p-2.5 rounded-xl border border-slate-100 italic">
                  "{mock.analysisNotes}"
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase">Mapped Weak Topics</span>
                <div className="flex flex-wrap gap-1.5">
                  {mock.weakAreas.map((area, i) => (
                    <span key={i} className="bg-rose-50/70 text-rose-700 px-2 py-0.5 rounded text-[10px] border border-rose-100/50">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

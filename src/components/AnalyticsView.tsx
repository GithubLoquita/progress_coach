/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  BarChart4, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Compass, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Subject, Chapter, MockTest, StudyLog, RevisionItem } from '../types';

interface AnalyticsViewProps {
  subjects: Subject[];
  chapters: Chapter[];
  mocks: MockTest[];
  studyLogs: StudyLog[];
  revisions: RevisionItem[];
}

export default function AnalyticsView({
  subjects,
  chapters,
  mocks,
  studyLogs,
  revisions
}: AnalyticsViewProps) {
  // Calculations
  const totalLogs = studyLogs.length;
  const totalStudyHours = studyLogs.reduce((acc, l) => acc + l.hours, 0).toFixed(1);
  const averageDailyHours = totalLogs > 0 ? (Number(totalStudyHours) / totalLogs).toFixed(1) : '0';
  
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(c => c.status === 'COMPLETED').length;
  const syllabusCompletionRate = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Revisions finished rate
  const finishedRevisions = revisions.filter(r => r.status === 'DONE').length;
  const totalRevisions = revisions.length;
  const revisionCompletionRate = totalRevisions > 0 ? Math.round((finishedRevisions / totalRevisions) * 100) : 100;

  // Mock test statistics
  const mockCount = mocks.length;
  const averageMockScore = mockCount > 0 ? Math.round(mocks.reduce((acc, m) => acc + m.score, 0) / mockCount) : 0;
  const averageMockAccuracy = mockCount > 0 ? Math.round(mocks.reduce((acc, m) => acc + m.accuracy, 0) / mockCount) : 0;

  // Construct coordinates for weekly study hours SVG chart
  const last7DaysLogs = studyLogs.slice(-7);
  const maxWeeklyHours = Math.max(...last7DaysLogs.map(l => l.hours), 8); // at least scale up to 8h
  const barChartWidth = 560;
  const barChartHeight = 160;
  const padding = 25;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Personal analytic metrics drawer</h2>
        <p className="text-xs text-gray-500">Examine aggregate study log parameters, mock test metrics, and syllabus structural progression charts.</p>
      </div>

      {/* Analytics KPI totals */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">Accumulated study time</span>
          <span className="text-2xl font-black text-gray-900">{totalStudyHours} <span className="text-xs text-gray-400">Hours</span></span>
          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-blue-500" /> Avg: {averageDailyHours} hrs / day logged
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">Overall Syllabus coverage</span>
          <span className="text-2xl font-black text-emerald-600">{syllabusCompletionRate}%</span>
          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {completedChapters} out of {totalChapters} chapter units finish
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">Recall Loops retention</span>
          <span className="text-2xl font-black text-indigo-600">{revisionCompletionRate}%</span>
          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-indigo-500" /> {finishedRevisions} revisions successfully recalled
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
          <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">average test parameter</span>
          <span className="text-2xl font-black text-rose-600">{averageMockScore} <span className="text-xs text-gray-400">/200</span></span>
          <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-rose-500" /> Accuracy avg of {averageMockAccuracy}%
          </div>
        </div>
      </div>

      {/* Two columns layout: Weekly Productivity bar vs Subject progression lists */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Weekly Productivity SVG bar chart */}
        <div className="md:col-span-2 rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
              <BarChart4 className="h-4.5 w-4.5 text-blue-600" />
              <span>Study Hours Productivity curve (Last 7 Days)</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase">Weekly metrics</span>
          </div>

          <div className="w-full overflow-x-auto scrollbar-none pt-4">
            {last7DaysLogs.length === 0 ? (
              <p className="text-center py-10 text-xs text-gray-400 italic">No logs recorded.</p>
            ) : (
              <div className="space-y-1">
                <svg width={barChartWidth} height={barChartHeight} className="mx-auto block">
                  {/* Grid Lines */}
                  <line x1={padding} y1={padding} x2={barChartWidth-padding} y2={padding} stroke="#f3f4f6" strokeWidth="1" />
                  <line x1={padding} y1={barChartHeight/2} x2={barChartWidth-padding} y2={barChartHeight/2} stroke="#f3f4f6" strokeWidth="1" />
                  <line x1={padding} y1={barChartHeight-padding} x2={barChartWidth-padding} y2={barChartHeight-padding} stroke="#e5e7eb" strokeWidth="1" />

                  {/* Render Columns */}
                  {last7DaysLogs.map((log, i) => {
                    const colCount = last7DaysLogs.length;
                    const colWidth = 35;
                    const colGap = (barChartWidth - 2 * padding - colCount * colWidth) / (colCount - 1);
                    const x = padding + i * (colWidth + colGap);
                    
                    // Height proportion
                    const barH = ((log.hours) / maxWeeklyHours) * (barChartHeight - 2 * padding);
                    const y = barChartHeight - padding - barH;

                    return (
                      <g key={log.date} className="group cursor-pointer">
                        {/* Rounded top rect columns */}
                        <rect
                          x={x}
                          y={y}
                          width={colWidth}
                          height={Math.max(barH, 4)}
                          rx="6"
                          className="fill-blue-600 group-hover:fill-blue-700 transition-colors"
                        />
                        {/* Height hours text indicator */}
                        <text
                          x={x + colWidth/2}
                          y={y - 6}
                          textAnchor="middle"
                          className="text-[10px] font-extrabold fill-slate-700"
                        >
                          {log.hours}h
                        </text>
                        {/* X axis Day count */}
                        <text
                          x={x + colWidth/2}
                          y={barChartHeight - 6}
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-slate-400"
                        >
                          {log.date.substring(5)}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-400 text-center">X-axis represents dates (MM-DD). Y-axis represents logged hours studied.</p>
        </div>

        {/* Subject progress structural list components */}
        <div className="rounded-3xl bg-white border border-gray-100 p-6 space-y-4 shadow-xs">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5 text-sm">
              <Layers className="h-4.5 w-4.5 text-indigo-500" />
              <span>Syllabus breakdown progression</span>
            </h3>
          </div>

          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {subjects.map((sub) => {
              const chaps = chapters.filter(c => c.subjectId === sub.id);
              const done = chaps.filter(c => c.status === 'COMPLETED').length;
              const pct = chaps.length > 0 ? Math.round((done / chaps.length) * 100) : 0;
              return (
                <div key={sub.id} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-semibold">
                    <span className="text-gray-700 truncate pr-2" title={sub.title}>{sub.title.substring(0, 32)}..</span>
                    <span className="text-gray-500 font-mono font-bold shrink-0">{pct}%</span>
                  </div>
                  
                  <div className="h-2 w-full rounded-full bg-slate-50 border border-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct === 100 ? 'bg-emerald-500' : pct > 50 ? 'bg-blue-500' : 'bg-amber-500'
                      }`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

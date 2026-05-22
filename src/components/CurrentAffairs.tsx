/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { 
  Globe, 
  Map, 
  BookOpen, 
  TrendingUp, 
  Atom, 
  Compass, 
  Plus, 
  Search, 
  Tag, 
  Bookmark,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CurrentAffairsItem } from '../types';

interface CurrentAffairsProps {
  currentAffairs: CurrentAffairsItem[];
  onAddCurrentAffairs: (item: Omit<CurrentAffairsItem, 'id'>) => void;
  onAddToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
}

export default function CurrentAffairs({
  currentAffairs,
  onAddCurrentAffairs,
  onAddToast
}: CurrentAffairsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CurrentAffairsItem['category']>('polity');
  const [tagsStr, setTagsStr] = useState('');

  const handleCreateCA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onAddToast('Please compile title and content notes correctly', 'warning');
      return;
    }

    const tags = tagsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);

    onAddCurrentAffairs({
      title: title.trim(),
      date,
      content: content.trim(),
      category,
      tags
    });

    setTitle('');
    setContent('');
    setTagsStr('');
    setShowAddForm(false);
    onAddToast('Daily Current Affairs issue bulletin logged', 'success');
  };

  const categoriesMap = [
    { id: 'all', label: 'All Columns', icon: Globe, color: 'text-blue-600' },
    { id: 'west-bengal', label: 'State (West Bengal)', icon: Map, color: 'text-emerald-600' },
    { id: 'polity', label: 'India Polity', icon: BookOpen, color: 'text-indigo-600' },
    { id: 'economy', label: 'Economics', icon: TrendingUp, color: 'text-amber-600' },
    { id: 'environment', label: 'Environment', icon: Atom, color: 'text-teal-600' },
    { id: 'national', label: 'National News', icon: Compass, color: 'text-rose-600' }
  ];

  const filteredCA = currentAffairs.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active daily Current Affairs hub</h2>
          <p className="text-xs text-gray-500">Log regional West Bengal updates & general national, international, and environmental agendas.</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 self-start rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-soft hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Record Daily Bulletin</span>
        </button>
      </div>

      {/* Filter Chips & Search Command bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-4 rounded-3xl border border-gray-100">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categoriesMap.map((cat) => {
            const CatIcon = cat.icon;
            const isCatActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  isCatActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <CatIcon className="h-4 w-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3.5 py-1.5 border border-transparent focus-within:border-gray-250">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bulletins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-gray-850 outline-none w-48"
          />
        </div>
      </div>

      {/* Compile bulletins Modal form */}
      {showAddForm && (
        <form onSubmit={handleCreateCA} className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600" /> Log Daily Current Agenda notes
            </h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 text-lg hover:text-slate-600">&times;</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase col-span-2">Bulletion / Agenda title</label>
              <input
                type="text"
                placeholder="e.g. Delimitation Commission Orders force of law"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Category Tag</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="polity">India Polity</option>
                <option value="economy">Economics</option>
                <option value="environment">Environment</option>
                <option value="national">National News</option>
                <option value="international">International Events</option>
                <option value="west-bengal">Regional West Bengal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Publish Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Specific Issue description details</label>
            <textarea
              rows={4}
              placeholder="RBI Approved surplus ledger dividend of INR 2.1 Lakh Cr. Mention key implications: lower fiscal deficit, support welfare schemes..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white outline-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Filing tags / Syllabus keywords (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. RBI Surplus, Fiscal Deficit, Revenue receipts"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
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
              Log Bulletin
            </button>
          </div>
        </form>
      )}

      {/* Bulletins cards list */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredCA.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 p-8 text-xs text-gray-400 bg-white rounded-3xl border border-gray-100">
            No Bulletins recorded in matching categories. Add one above!
          </div>
        ) : (
          filteredCA.map((item) => {
            const targetColorMap = categoriesMap.find(cat => cat.id === item.category);
            return (
              <div 
                key={item.id} 
                className="rounded-3xl border border-gray-100 bg-white p-5 flex flex-col justify-between shadow-xs hover:shadow-sm hover:border-gray-300 transition"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase tracking-wider rounded-md px-2 py-0.5 border ${
                      item.category === 'west-bengal' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      item.category === 'polity' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                      item.category === 'economy' ? 'bg-amber-50 text-amber-700 border-amber-150' :
                      item.category === 'environment' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                      'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {targetColorMap ? targetColorMap.label : item.category}
                    </span>

                    <span className="text-[10px] text-gray-450 font-bold flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {item.date}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-extrabold text-gray-900 leading-snug">{item.title}</h4>
                    <p className="whitespace-pre-line text-xs text-slate-650 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-50">
                  {item.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      onClick={() => setSearchQuery(tag)}
                      className="cursor-pointer bg-slate-50 text-slate-500 hover:text-blue-600 px-2.5 py-0.5 rounded text-[10px] font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}

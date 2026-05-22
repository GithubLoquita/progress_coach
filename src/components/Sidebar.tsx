/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  IdCard, 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  RefreshCw, 
  Award, 
  Globe, 
  FileText, 
  HeartPulse, 
  BarChart4, 
  BellRing,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  onSelectTab, 
  collapsed, 
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-600', bg: 'hover:bg-blue-50/50 hover:text-blue-700' },
    { id: 'subjects', label: 'Subject Syllabus', icon: BookOpen, color: 'text-emerald-600', bg: 'hover:bg-emerald-50/50 hover:text-emerald-700' },
    { id: 'planner', label: 'Daily Planner', icon: Calendar, color: 'text-amber-600', bg: 'hover:bg-amber-50/50 hover:text-amber-700' },
    { id: 'revision', label: 'Spaced Revision', icon: RefreshCw, color: 'text-purple-600', bg: 'hover:bg-purple-50/50 hover:text-purple-700' },
    { id: 'mocks', label: 'Mock Tests', icon: Award, color: 'text-rose-600', bg: 'hover:bg-rose-50/50 hover:text-rose-700' },
    { id: 'ca', label: 'Current Affairs', icon: Globe, color: 'text-sky-600', bg: 'hover:bg-sky-50/50 hover:text-sky-700' },
    { id: 'notes', label: 'Revision Notes', icon: FileText, color: 'text-indigo-600', bg: 'hover:bg-indigo-50/50 hover:text-indigo-700' },
    { id: 'interview', label: 'Interview Guide', icon: IdCard, color: 'text-teal-600', bg: 'hover:bg-teal-50/50 hover:text-teal-700' },
    { id: 'motivation', label: 'Streaks & Habits', icon: HeartPulse, color: 'text-red-500', bg: 'hover:bg-red-50/50 hover:text-red-600' },
    { id: 'analytics', label: 'Analytics Board', icon: BarChart4, color: 'text-amber-500', bg: 'hover:bg-amber-50/50 hover:text-amber-600' },
    { id: 'reminders', label: 'Smart Reminders', icon: BellRing, color: 'text-blue-500', bg: 'hover:bg-blue-50/50 hover:text-blue-600' }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-100 bg-white transition-all duration-300 lg:static lg:z-0 lg:translate-x-0 ${
          mobileOpen 
            ? 'translate-x-0 w-64 shadow-2xl' 
            : '-translate-x-full lg:translate-x-0'
        } ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          !mobileOpen && !collapsed ? 'w-64' : ''
        } ${
          !mobileOpen && collapsed ? 'w-20' : ''
        }`}
      >
        {/* Mobile Header visual info inside Drawer */}
        {mobileOpen && (
          <div className="flex justify-between items-center p-4 border-b border-gray-100 lg:hidden shrink-0">
            <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">WBCS Coach Navigator</span>
            <button 
              onClick={onCloseMobile}
              className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-150 rounded-lg transition-colors"
              title="Close Navigation Drawer"
              aria-label="Close navigation"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile?.();
                }}
                className={`flex w-full items-center gap-3.5 rounded-full py-3 px-4 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : `text-gray-600 ${item.bg}`
                }`}
              >
                <div className="flex items-center justify-center">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color}`} />
                </div>
                {/* Always display labels in mobile slide-out, on desktop respect collapse status */}
                <span className={`truncate transition-opacity duration-200 ${
                  collapsed ? 'lg:hidden' : 'lg:inline'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer Banner/Toggle Collapse Button */}
        <div className="flex border-t border-gray-100 p-4 justify-between items-center bg-gray-50/50 shrink-0">
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider">PREPARATION LEVEL</span>
              <span className="text-xs font-semibold text-gray-700">WBCS Group A Focus</span>
            </div>
          )}
          <button 
            onClick={onToggleCollapse}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 self-center mx-auto lg:block hidden"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
      </aside>
    </>
  );
}

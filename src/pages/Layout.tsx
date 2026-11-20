import React, { useState } from 'react';
import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { 
  Shield, LayoutDashboard, Briefcase, UserCheck, ClipboardList, 
  Trash2, FileText, Terminal, Users, Lock, Clock, Activity,
  Globe, Unlock, AlertOctagon, Search, SlidersHorizontal, StickyNote,
  Menu, X, ChevronDown, LogOut
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useUiStore } from '../stores/uiStore';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const location = useLocation();
  
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { quickNotes, setQuickNotes, showQuickNotes, setShowQuickNotes, notePosition, setNotePosition } = useUiStore();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/evidence', label: 'Evidence', icon: ClipboardList },
    { path: '/suspects', label: 'Suspects', icon: UserCheck },
    { path: '/incidents', label: 'Incidents', icon: FileText },
    { path: '/audit', label: 'Audit Logs', icon: Terminal },
    { path: '/users', label: 'Personnel', icon: Users },
  ];

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleUnlock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const pin = formData.get('pin') as string;
    if (pin === '1204') {
      setIsLocked(false);
    } else {
      alert('INVALID SECURITY LOCK PIN');
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-6 text-center space-y-6 shadow-xl">
          <div className="p-3 bg-red-50 text-red-600 rounded-full mb-2 border border-red-100 inline-block">
            <Lock className="h-6 w-6 mx-auto" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Secure Terminal Secured</h1>
          <p className="text-xs text-slate-500 font-mono">T-104 • PRECINCT 12 AUTHORITY</p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5 text-left">Enter Credentials PIN</label>
              <input
                type="password"
                name="pin"
                required
                placeholder="••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center text-slate-900 tracking-widest focus:outline-none focus:border-red-500/50"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-850 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-sans"
            >
              <Unlock className="h-4 w-4 text-emerald-500" /> Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans dark:bg-slate-900 dark:text-slate-100">
      {/* Top Banner */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 flex flex-wrap justify-between items-center gap-4 text-xs font-mono select-none">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight">PRECINCT 12 OPERATIONS</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Clock className="h-5 w-5 text-amber-400" /> : <Activity className="h-5 w-5 text-emerald-500" />}
          </button>
          <button
            onClick={() => setShowQuickNotes(!showQuickNotes)}
            className={`border px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors text-[11px] cursor-pointer ${
              showQuickNotes
                ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100/50 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-500/30 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}
          >
            <StickyNote className="h-3.5 w-3.5" /> Notes
          </button>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
                {user.name} ({user.badgeNumber})
              </span>
              <button
                onClick={handleLock}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Lock terminal"
              >
                <Lock className="h-5 w-5 text-slate-500" />
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-red-500"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Navigation sidebar"
        >
          <nav className="flex flex-col h-full p-4 space-y-2 overflow-y-auto" role="navigation" aria-label="Main navigation">
            <div className="px-3 py-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 mb-2">
              MODULES
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <div className="flex-1" />
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-mono text-slate-500 text-center">
                CMS v4.1.2-Secure
              </p>
            </div>
          </nav>
        </aside>

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Quick Notes Widget */}
      {showQuickNotes && (
        <div
          style={{ 
            left: notePosition.x, 
            top: notePosition.y 
          }}
          className="fixed z-50 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">QUICK NOTES</span>
            <button
              onClick={() => setShowQuickNotes(false)}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <textarea
            value={quickNotes}
            onChange={(e) => setQuickNotes(e.target.value)}
            placeholder="Secure field notes... auto-saved locally"
            className="w-full h-32 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-sans"
            rows={6}
          />
        </div>
      )}
    </div>
  );
}
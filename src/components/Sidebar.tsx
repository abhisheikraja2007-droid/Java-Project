import React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  UserCheck,
  ClipboardList,
  Trash2,
  FileText,
  Terminal,
  Users,
  Lock,
  Activity,
  Globe,
  Unlock,
  AlertOctagon,
  Search,
  SlidersHorizontal,
  StickyNote,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useUiStore } from '../stores/uiStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cases', label: 'Cases', icon: Briefcase },
  { path: '/suspects', label: 'Suspects', icon: UserCheck },
  { path: '/evidence', label: 'Evidence', icon: ClipboardList },
  { path: '/incidents', label: 'Incidents', icon: FileText },
  { path: '/audit', label: 'Audit Logs', icon: Terminal },
  { path: '/users', label: 'Personnel', icon: Users },
];

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const { quickNotes, setQuickNotes, showQuickNotes, setShowQuickNotes, notePosition, setNotePosition } = useUiStore();

  const handleLock = () => {
    // Lock functionality would be handled by parent or context
    console.log('Lock terminal');
  };

  return (
    <>
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation sidebar"
      >
        <nav className="flex flex-col h-full p-4 space-y-2 overflow-y-auto" role="navigation" aria-label="Main navigation">
          <div className="px-3 py-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 mb-2">
            MODULES
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white'
                }`}
                end={item.path === '/'}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
          <div className="flex-1" />
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
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
            <div className="mt-4 text-center">
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                CMS v4.1.2-Secure
              </p>
            </div>
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
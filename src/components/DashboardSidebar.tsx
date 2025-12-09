import { Home, FileText, Users, Bell, BarChart3, Brain, Settings, Circle } from 'lucide-react';
import { cn } from './ui/utils';

interface DashboardSidebarProps {
  currentView: 'dashboard' | 'casos' | 'contribuyentes' | 'alertas' | 'reportes' | 'ai-analytics' | 'settings';
  onViewChange: (view: 'dashboard' | 'casos' | 'contribuyentes' | 'alertas' | 'reportes' | 'ai-analytics' | 'settings') => void;
}

export default function DashboardSidebar({ currentView, onViewChange }: DashboardSidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Inicio', view: 'dashboard' as const },
    { id: 'casos', icon: FileText, label: 'Casos', view: 'casos' as const },
    { id: 'contribuyentes', icon: Users, label: 'Contribuyentes', view: 'contribuyentes' as const },
    { id: 'alertas', icon: Bell, label: 'Alertas', view: 'alertas' as const },
    { id: 'reportes', icon: BarChart3, label: 'Reportes', view: 'reportes' as const },
    { id: 'ia-analytics', icon: Brain, label: 'IA Analítica', view: 'ai-analytics' as const },
    { id: 'settings', icon: Settings, label: 'Configuración', view: 'settings' as const },
  ];

  return (
    <aside className="w-64 bg-[#003876] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[#003876] opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Logo SVG */}
            <svg viewBox="0 0 100 100" className="w-9 h-9 relative z-10">
              {/* Shield background */}
              <path
                d="M50 10 L80 25 L80 50 Q80 75 50 90 Q20 75 20 50 L20 25 Z"
                fill="#003876"
                opacity="0.15"
              />
              
              {/* Letter S with professional styling */}
              <text 
                x="50" 
                y="58" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fill="#003876" 
                fontSize="48"
                fontWeight="800"
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ letterSpacing: '-2px' }}
              >
                S
              </text>
              
              {/* Accent element */}
              <circle cx="75" cy="30" r="4" fill="#E74C3C" opacity="0.8" />
            </svg>
          </div>
          <div>
            <div className="text-white tracking-wide">SUNAT</div>
            <div className="text-xs text-white/70">Fiscalización</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.view === currentView;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.view)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Connection status */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Circle className="w-2 h-2 fill-green-400 text-green-400" />
          <span>Sesión activa</span>
        </div>
      </div>
    </aside>
  );
}
import { Bell, LogOut, AlertTriangle, TrendingUp, FileText, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState } from 'react';

interface User {
  code: string;
  name: string;
  role: string;
}

interface DashboardHeaderProps {
  onLogout: () => void;
  currentUser: User;
}

interface Notification {
  id: string;
  type: 'alert' | 'case' | 'report';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Alerta de Alto Riesgo',
    message: 'Nuevo contribuyente detectado con patrón de evasión fiscal (RUC: 20567891234)',
    time: 'Hace 5 min',
    read: false
  },
  {
    id: '2',
    type: 'case',
    title: 'Caso Asignado',
    message: 'Se le ha asignado el caso #2024-089 - Revisión de Exportaciones Ficticias',
    time: 'Hace 1 hora',
    read: false
  },
  {
    id: '3',
    type: 'alert',
    title: 'Anomalía Detectada',
    message: 'Discrepancia en declaraciones mensuales - Textiles Import S.A.C.',
    time: 'Hace 2 horas',
    read: false
  },
  {
    id: '4',
    type: 'report',
    title: 'Reporte Completado',
    message: 'El reporte trimestral Q4-2024 está listo para revisión',
    time: 'Hace 3 horas',
    read: true
  },
  {
    id: '5',
    type: 'case',
    title: 'Actualización de Caso',
    message: 'Caso #2024-067 requiere documentación adicional',
    time: 'Ayer',
    read: true
  }
];

export default function DashboardHeader({ onLogout, currentUser }: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'case':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'report':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>

            {/* Notifications Panel */}
            {notificationsOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotificationsOpen(false)}
                ></div>
                
                {/* Panel */}
                <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-900">Notificaciones</h3>
                      {unreadCount > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {unreadCount} {unreadCount === 1 ? 'nueva' : 'nuevas'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs text-[#003876] hover:text-[#002555]"
                        >
                          Marcar todas
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNotificationsOpen(false)}
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No hay notificaciones</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className={`text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1.5">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 text-center">
                      <button className="text-sm text-[#003876] hover:text-[#002555] hover:underline">
                        Ver todas las notificaciones
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <Avatar>
              <AvatarFallback className="bg-[#003876] text-white">
                {getInitials(currentUser.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-gray-900">{currentUser.name}</div>
              <div className="text-xs text-gray-500">{currentUser.role}</div>
            </div>
          </div>

          {/* Logout */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onLogout}
            className="text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
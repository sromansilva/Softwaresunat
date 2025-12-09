import { useState, useEffect, useRef } from 'react';
import { Settings, User, Bell, Shield, Database, Mail, Lock, Globe, Palette, Zap, Save, AlertCircle, Upload, Camera, X, Check, Activity, FileText, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { Slider } from './ui/slider';
import { useTheme } from '../contexts/ThemeContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

interface CurrentUser {
  code: string;
  name: string;
  role: string;
}

interface SettingsPageProps {
  currentUser: CurrentUser;
}

const DEFAULT_SETTINGS = {
  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  criticalAlerts: true,
  weeklyReports: true,
  monthlyReports: true,
  
  // Security
  twoFactorAuth: false,
  sessionTimeout: [30],
  
  // System
  autoAssignCases: false,
  aiAnalytics: true,
  riskThreshold: [70],
  language: 'es-pe',
  timezone: 'america-lima',
  dateFormat: 'dd-mm-yyyy',
  currency: 'pen',
  
  // Appearance
  darkMode: false,
  interfaceDensity: 'normal',
  fontSize: 'medium',
  accentColor: '#003876',
  defaultPage: 'dashboard',
};

export default function SettingsPage({ currentUser }: SettingsPageProps) {
  // Get theme context
  const { accentColor: globalAccentColor, setAccentColor: setGlobalAccentColor } = useTheme();
  
  // Parse user name
  const nameParts = currentUser.name.split(' ');
  const userFirstName = nameParts[0] || 'Usuario';
  const userLastName = nameParts.slice(1).join(' ') || 'SUNAT';
  const userEmail = `${currentUser.code.toLowerCase()}@sunat.gob.pe`;
  
  // User profile states
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(userFirstName);
  const [lastName, setLastName] = useState(userLastName);
  const [email, setEmail] = useState(userEmail);
  const [phone, setPhone] = useState('+51 987 654 321');
  const [office, setOffice] = useState('lima');
  
  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(DEFAULT_SETTINGS.emailNotifications);
  const [pushNotifications, setPushNotifications] = useState(DEFAULT_SETTINGS.pushNotifications);
  const [criticalAlerts, setCriticalAlerts] = useState(DEFAULT_SETTINGS.criticalAlerts);
  const [weeklyReports, setWeeklyReports] = useState(DEFAULT_SETTINGS.weeklyReports);
  const [monthlyReports, setMonthlyReports] = useState(DEFAULT_SETTINGS.monthlyReports);
  const [notificationEmail, setNotificationEmail] = useState(userEmail);
  
  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(DEFAULT_SETTINGS.twoFactorAuth);
  const [sessionTimeout, setSessionTimeout] = useState(DEFAULT_SETTINGS.sessionTimeout);
  
  // System states
  const [autoAssignCases, setAutoAssignCases] = useState(DEFAULT_SETTINGS.autoAssignCases);
  const [aiAnalytics, setAiAnalytics] = useState(DEFAULT_SETTINGS.aiAnalytics);
  const [riskThreshold, setRiskThreshold] = useState(DEFAULT_SETTINGS.riskThreshold);
  const [language, setLanguage] = useState(DEFAULT_SETTINGS.language);
  const [timezone, setTimezone] = useState(DEFAULT_SETTINGS.timezone);
  const [dateFormat, setDateFormat] = useState(DEFAULT_SETTINGS.dateFormat);
  const [currency, setCurrency] = useState(DEFAULT_SETTINGS.currency);
  
  // Appearance states
  const [darkMode, setDarkMode] = useState(DEFAULT_SETTINGS.darkMode);
  const [interfaceDensity, setInterfaceDensity] = useState(DEFAULT_SETTINGS.interfaceDensity);
  const [fontSize, setFontSize] = useState(DEFAULT_SETTINGS.fontSize);
  const [defaultPage, setDefaultPage] = useState(DEFAULT_SETTINGS.defaultPage);

  // Advanced settings states
  const [lastSync, setLastSync] = useState('Hace 5 minutos');
  const [lastBackup, setLastBackup] = useState('Hoy 02:00 AM');
  const [apiSunatStatus, setApiSunatStatus] = useState<'connected' | 'disconnected'>('connected');
  const [apiSunatKey, setApiSunatKey] = useState('sk_prod_xxxxxxxxxxxxxx');
  const [comprobantesStatus, setComprobantesStatus] = useState<'active' | 'inactive'>('active');
  const [comprobantesUrl, setComprobantesUrl] = useState('https://api.sunat.gob.pe/comprobantes');
  const [iaVersion, setIaVersion] = useState('2.4.1');
  const [iaModelConfig, setIaModelConfig] = useState('gpt-4-turbo');
  
  // Dialog states
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [showComprobantesDialog, setShowComprobantesDialog] = useState(false);
  const [showIADialog, setShowIADialog] = useState(false);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [showAuditDialog, setShowAuditDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('sunat_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        
        // Load user profile
        setProfilePhoto(parsed.profilePhoto || null);
        setFirstName(parsed.firstName || userFirstName);
        setLastName(parsed.lastName || userLastName);
        setEmail(parsed.email || userEmail);
        setPhone(parsed.phone || '+51 987 654 321');
        setOffice(parsed.office || 'lima');
        
        // Load notifications
        setEmailNotifications(parsed.emailNotifications ?? DEFAULT_SETTINGS.emailNotifications);
        setPushNotifications(parsed.pushNotifications ?? DEFAULT_SETTINGS.pushNotifications);
        setCriticalAlerts(parsed.criticalAlerts ?? DEFAULT_SETTINGS.criticalAlerts);
        setWeeklyReports(parsed.weeklyReports ?? DEFAULT_SETTINGS.weeklyReports);
        setMonthlyReports(parsed.monthlyReports ?? DEFAULT_SETTINGS.monthlyReports);
        
        // Load security
        setTwoFactorAuth(parsed.twoFactorAuth ?? DEFAULT_SETTINGS.twoFactorAuth);
        setSessionTimeout(parsed.sessionTimeout || DEFAULT_SETTINGS.sessionTimeout);
        
        // Load system
        setAutoAssignCases(parsed.autoAssignCases ?? DEFAULT_SETTINGS.autoAssignCases);
        setAiAnalytics(parsed.aiAnalytics ?? DEFAULT_SETTINGS.aiAnalytics);
        setRiskThreshold(parsed.riskThreshold || DEFAULT_SETTINGS.riskThreshold);
        setLanguage(parsed.language || DEFAULT_SETTINGS.language);
        setTimezone(parsed.timezone || DEFAULT_SETTINGS.timezone);
        setDateFormat(parsed.dateFormat || DEFAULT_SETTINGS.dateFormat);
        setCurrency(parsed.currency || DEFAULT_SETTINGS.currency);
        
        // Load appearance
        setDarkMode(parsed.darkMode ?? DEFAULT_SETTINGS.darkMode);
        setInterfaceDensity(parsed.interfaceDensity || DEFAULT_SETTINGS.interfaceDensity);
        setFontSize(parsed.fontSize || DEFAULT_SETTINGS.fontSize);
        // Note: accentColor is now handled by ThemeContext, not loaded here
        setDefaultPage(parsed.defaultPage || DEFAULT_SETTINGS.defaultPage);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona una imagen válida');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 2MB');
        return;
      }
      
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        toast.success('Foto de perfil actualizada');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveSettings = () => {
    const settings = {
      // Profile
      profilePhoto,
      firstName,
      lastName,
      email,
      phone,
      office,
      
      // Notifications
      emailNotifications,
      pushNotifications,
      criticalAlerts,
      weeklyReports,
      monthlyReports,
      
      // Security
      twoFactorAuth,
      sessionTimeout,
      
      // System
      autoAssignCases,
      aiAnalytics,
      riskThreshold,
      language,
      timezone,
      dateFormat,
      currency,
      
      // Appearance
      darkMode,
      interfaceDensity,
      fontSize,
      accentColor: globalAccentColor, // Use global accent color from context
      defaultPage,
    };
    
    localStorage.setItem('sunat_settings', JSON.stringify(settings));
    toast.success('Configuración guardada exitosamente', {
      description: 'Todos los cambios han sido aplicados correctamente'
    });
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setProfilePhoto(null);
    setFirstName(userFirstName);
    setLastName(userLastName);
    setEmail(userEmail);
    setPhone('+51 987 654 321');
    setOffice('lima');
    
    setEmailNotifications(DEFAULT_SETTINGS.emailNotifications);
    setPushNotifications(DEFAULT_SETTINGS.pushNotifications);
    setCriticalAlerts(DEFAULT_SETTINGS.criticalAlerts);
    setWeeklyReports(DEFAULT_SETTINGS.weeklyReports);
    setMonthlyReports(DEFAULT_SETTINGS.monthlyReports);
    
    setTwoFactorAuth(DEFAULT_SETTINGS.twoFactorAuth);
    setSessionTimeout(DEFAULT_SETTINGS.sessionTimeout);
    
    setAutoAssignCases(DEFAULT_SETTINGS.autoAssignCases);
    setAiAnalytics(DEFAULT_SETTINGS.aiAnalytics);
    setRiskThreshold(DEFAULT_SETTINGS.riskThreshold);
    setLanguage(DEFAULT_SETTINGS.language);
    setTimezone(DEFAULT_SETTINGS.timezone);
    setDateFormat(DEFAULT_SETTINGS.dateFormat);
    setCurrency(DEFAULT_SETTINGS.currency);
    
    setDarkMode(DEFAULT_SETTINGS.darkMode);
    setInterfaceDensity(DEFAULT_SETTINGS.interfaceDensity);
    setFontSize(DEFAULT_SETTINGS.fontSize);
    setGlobalAccentColor(DEFAULT_SETTINGS.accentColor); // Use global setter from context
    setDefaultPage(DEFAULT_SETTINGS.defaultPage);
    
    // Clear password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Clear from localStorage
    localStorage.removeItem('sunat_settings');
    
    toast.info('Configuración restablecida', {
      description: 'Todos los valores han vuelto a sus valores predeterminados'
    });
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Por favor completa todos los campos de contraseña');
      return;
    }
    
    if (currentPassword !== 'sunat2024') {
      toast.error('La contraseña actual es incorrecta');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    toast.success('Contraseña actualizada exitosamente', {
      description: 'Tu contraseña ha sido cambiada correctamente'
    });
  };

  const handleCloseSession = (sessionName: string) => {
    toast.success(`Sesión cerrada: ${sessionName}`);
  };

  const handleSync = () => {
    toast.loading('Sincronizando datos...', { id: 'sync' });
    setTimeout(() => {
      const now = new Date();
      const timeStr = 'Hace unos segundos';
      setLastSync(timeStr);
      toast.success('Sincronización completada', { id: 'sync' });
    }, 2000);
  };

  const handleBackup = () => {
    toast.loading('Creando respaldo...', { id: 'backup' });
    setTimeout(() => {
      const now = new Date();
      const timeStr = `Hoy ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLastBackup(timeStr);
      toast.success('Respaldo creado exitosamente', { id: 'backup' });
    }, 2000);
  };

  const handleClearCache = () => {
    toast.loading('Limpiando caché...', { id: 'cache' });
    setTimeout(() => {
      toast.success('Caché limpiado exitosamente', { id: 'cache' });
    }, 1500);
  };

  const handleOptimizeDB = () => {
    toast.loading('Optimizando base de datos...', { id: 'optimize' });
    setTimeout(() => {
      toast.success('Base de datos optimizada', { id: 'optimize' });
    }, 2500);
  };

  const handleRestartSystem = () => {
    toast.error('Función deshabilitada en demo', {
      description: 'Esta función requiere permisos de administrador'
    });
  };

  const handleSaveApiConfig = () => {
    toast.success('Configuración de API SUNAT guardada', {
      description: 'Los cambios han sido aplicados correctamente'
    });
    setShowApiDialog(false);
  };

  const handleSaveComprobantesConfig = () => {
    toast.success('Configuración de Comprobantes guardada', {
      description: 'Los cambios han sido aplicados correctamente'
    });
    setShowComprobantesDialog(false);
  };

  const handleSaveIAConfig = () => {
    toast.success('Configuración de IA Analítica guardada', {
      description: 'Los cambios han sido aplicados correctamente'
    });
    setShowIADialog(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#003876]">Configuración del Sistema</h1>
          <p className="text-gray-600">Personaliza tu experiencia y gestiona preferencias</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            Restablecer
          </Button>
          <Button className="bg-[#003876] hover:bg-[#002555]" onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="w-4 h-4 mr-2" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Apariencia
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Zap className="w-4 h-4 mr-2" />
            Avanzado
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información de perfil y datos de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24">
                    {profilePhoto ? (
                      <AvatarImage src={profilePhoto} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-[#003876] text-white text-2xl">
                        {firstName[0]}{lastName[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <button
                    onClick={handlePhotoClick}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div>
                  <Button variant="outline" onClick={handlePhotoClick}>
                    <Upload className="w-4 h-4 mr-2" />
                    Cambiar Foto
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG. Máx 2MB</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input 
                    id="lastName" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input id="position" value={currentUser.role} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Input id="department" value="Fiscalización Tributaria" readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="office">Oficina</Label>
                <Select value={office} onValueChange={setOffice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lima">Lima - Oficina Principal</SelectItem>
                    <SelectItem value="callao">Callao</SelectItem>
                    <SelectItem value="arequipa">Arequipa</SelectItem>
                    <SelectItem value="cusco">Cusco</SelectItem>
                    <SelectItem value="trujillo">Trujillo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Gestiona cómo y cuándo recibir notificaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-gray-500">Recibe alertas y actualizaciones por correo electrónico</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real en el navegador</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas Críticas</Label>
                    <p className="text-sm text-gray-500">Notificaciones inmediatas para casos de alta prioridad</p>
                  </div>
                  <Switch checked={criticalAlerts} onCheckedChange={setCriticalAlerts} />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm mb-4">Reportes Automáticos</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reporte Semanal</Label>
                      <p className="text-sm text-gray-500">Resumen de actividades cada lunes</p>
                    </div>
                    <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reporte Mensual</Label>
                      <p className="text-sm text-gray-500">Informe completo el primer día de cada mes</p>
                    </div>
                    <Switch checked={monthlyReports} onCheckedChange={setMonthlyReports} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad de la Cuenta</CardTitle>
              <CardDescription>Protege tu cuenta y datos personales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm mb-4">Cambiar Contraseña</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" onClick={handlePasswordChange}>
                      <Lock className="w-4 h-4 mr-2" />
                      Actualizar Contraseña
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de Dos Factores</Label>
                    <p className="text-sm text-gray-500">Agrega una capa extra de seguridad a tu cuenta</p>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Tiempo de Inactividad (minutos)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={sessionTimeout}
                      onValueChange={setSessionTimeout}
                      max={120}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm text-gray-600">{sessionTimeout[0]} min</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Cerrar sesión automáticamente después de este tiempo de inactividad
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm mb-3">Sesiones Activas</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm">Windows - Chrome</p>
                      <p className="text-xs text-gray-500">Lima, Perú - Activa ahora</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCloseSession('Windows - Chrome')}
                    >
                      Cerrar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm">Android - Mobile App</p>
                      <p className="text-xs text-gray-500">Lima, Perú - Hace 2 horas</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCloseSession('Android - Mobile App')}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>Ajusta el comportamiento del sistema de fiscalización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Asignación Automática de Casos</Label>
                    <p className="text-sm text-gray-500">Distribuir casos nuevos automáticamente entre auditores</p>
                  </div>
                  <Switch checked={autoAssignCases} onCheckedChange={setAutoAssignCases} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IA Analítica Habilitada</Label>
                    <p className="text-sm text-gray-500">Usar inteligencia artificial para detección de patrones</p>
                  </div>
                  <Switch checked={aiAnalytics} onCheckedChange={setAiAnalytics} />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Umbral de Riesgo para Alertas Automáticas</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={riskThreshold}
                      onValueChange={setRiskThreshold}
                      max={100}
                      min={0}
                      step={5}
                      className="flex-1"
                    />
                    <span className="w-12 text-sm text-gray-600">{riskThreshold[0]}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Generar alerta automática cuando el score de riesgo supere este valor
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Región/Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <Globe className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es-pe">Español (Perú)</SelectItem>
                      <SelectItem value="es">Español (España)</SelectItem>
                      <SelectItem value="en">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-lima">(GMT-5) Lima</SelectItem>
                      <SelectItem value="america-bogota">(GMT-5) Bogotá</SelectItem>
                      <SelectItem value="america-mexico">(GMT-6) Ciudad de México</SelectItem>
                      <SelectItem value="america-santiago">(GMT-4) Santiago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Formato de Fecha</Label>
                  <Select value={dateFormat} onValueChange={setDateFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Formato de Moneda</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pen">Soles (S/.)</SelectItem>
                      <SelectItem value="usd">Dólares ($)</SelectItem>
                      <SelectItem value="eur">Euros (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalización de Interfaz</CardTitle>
              <CardDescription>Ajusta la apariencia visual del dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Oscuro</Label>
                  <p className="text-sm text-gray-500">Activar tema oscuro para reducir fatiga visual</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Densidad de Interfaz</Label>
                <Select value={interfaceDensity} onValueChange={setInterfaceDensity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compacto</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="comfortable">Cómodo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tamaño de Fuente</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequeña</SelectItem>
                    <SelectItem value="medium">Mediana</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Color de Acento</Label>
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { name: 'Azul SUNAT', color: '#003876' },
                    { name: 'Azul', color: '#0066CC' },
                    { name: 'Verde', color: '#10B981' },
                    { name: 'Rojo', color: '#E74C3C' },
                    { name: 'Morado', color: '#8B5CF6' },
                    { name: 'Naranja', color: '#F59E0B' },
                  ].map((item) => (
                    <button
                      key={item.name}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        globalAccentColor === item.color 
                          ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                      onClick={() => {
                        setGlobalAccentColor(item.color);
                        toast.success('Color de acento actualizado', {
                          description: `Ahora usando: ${item.name}`
                        });
                      }}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Página de Inicio Predeterminada</Label>
                <Select value={defaultPage} onValueChange={setDefaultPage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard Principal</SelectItem>
                    <SelectItem value="casos">Casos</SelectItem>
                    <SelectItem value="contribuyentes">Contribuyentes</SelectItem>
                    <SelectItem value="alertas">Alertas</SelectItem>
                    <SelectItem value="reportes">Reportes</SelectItem>
                    <SelectItem value="ia-analytics">IA Analítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Avanzada</CardTitle>
              <CardDescription>Opciones para usuarios avanzados y administradores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  Estas opciones son para usuarios avanzados. Cambios incorrectos pueden afectar el funcionamiento del sistema.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm mb-3">Base de Datos</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">Sincronización de Datos</p>
                        <p className="text-xs text-gray-500">Última sincronización: {lastSync}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleSync}>
                        Sincronizar Ahora
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">Respaldo de Base de Datos</p>
                        <p className="text-xs text-gray-500">Último respaldo: {lastBackup}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleBackup}>
                        Crear Respaldo
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm mb-3">Integraciones</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">API SUNAT</p>
                        <p className="text-xs text-gray-500">Estado: {apiSunatStatus === 'connected' ? 'Conectado' : 'Desconectado'}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowApiDialog(true)}>Configurar</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">Sistema de Comprobantes Electrónicos</p>
                        <p className="text-xs text-gray-500">Estado: {comprobantesStatus === 'active' ? 'Activo' : 'Inactivo'}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowComprobantesDialog(true)}>Configurar</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">Motor de IA Analítica</p>
                        <p className="text-xs text-gray-500">Versión: {iaVersion}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowIADialog(true)}>Configurar</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm mb-3">Logs y Auditoría</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">Registro de Actividades</p>
                        <p className="text-xs text-gray-500">12,453 eventos registrados hoy</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowLogsDialog(true)}>Ver Logs</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">Auditoría de Cambios</p>
                        <p className="text-xs text-gray-500">247 cambios en el sistema este mes</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowAuditDialog(true)}>Ver Auditoría</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm mb-3">Mantenimiento</h4>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleClearCache}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Limpiar Caché del Sistema
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleOptimizeDB}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Optimizar Base de Datos
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={handleRestartSystem}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Reiniciar Sistema
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Versión del Sistema</p>
                  <p>v3.2.1</p>
                </div>
                <div>
                  <p className="text-gray-600">Última Actualización</p>
                  <p>15 de Febrero, 2024</p>
                </div>
                <div>
                  <p className="text-gray-600">Base de Datos</p>
                  <p>PostgreSQL 14.5</p>
                </div>
                <div>
                  <p className="text-gray-600">Servidor</p>
                  <p>SUNAT-FISC-PROD-01</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={showApiDialog} onOpenChange={setShowApiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de API SUNAT</DialogTitle>
            <DialogDescription>Configura los detalles de la API de SUNAT para integración</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiSunatKey">Clave de API</Label>
              <Input 
                id="apiSunatKey" 
                value={apiSunatKey} 
                onChange={(e) => setApiSunatKey(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApiDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#003876] hover:bg-[#002555]" onClick={handleSaveApiConfig}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showComprobantesDialog} onOpenChange={setShowComprobantesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de Comprobantes Electrónicos</DialogTitle>
            <DialogDescription>Configura los detalles del sistema de comprobantes electrónicos</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comprobantesUrl">URL del Servicio</Label>
              <Input 
                id="comprobantesUrl" 
                value={comprobantesUrl} 
                onChange={(e) => setComprobantesUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowComprobantesDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#003876] hover:bg-[#002555]" onClick={handleSaveComprobantesConfig}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showIADialog} onOpenChange={setShowIADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configuración de IA Analítica</DialogTitle>
            <DialogDescription>Configura los detalles del motor de IA analítica</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iaModelConfig">Modelo de IA</Label>
              <Select value={iaModelConfig} onValueChange={setIaModelConfig}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIADialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#003876] hover:bg-[#002555]" onClick={handleSaveIAConfig}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registro de Actividades</DialogTitle>
            <DialogDescription>Revisa los logs de actividades del sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>15 de Febrero, 2024 10:30 AM</TableCell>
                  <TableCell>Usuario123</TableCell>
                  <TableCell>Inicio de Sesión</TableCell>
                  <TableCell>Windows - Chrome</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15 de Febrero, 2024 11:00 AM</TableCell>
                  <TableCell>Usuario123</TableCell>
                  <TableCell>Actualización de Configuración</TableCell>
                  <TableCell>Modo Oscuro: Activado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15 de Febrero, 2024 11:30 AM</TableCell>
                  <TableCell>Usuario123</TableCell>
                  <TableCell>Creación de Respaldo</TableCell>
                  <TableCell>Base de Datos</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogsDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Auditoría de Cambios</DialogTitle>
            <DialogDescription>Revisa los cambios realizados en el sistema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Cambio</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>15 de Febrero, 2024 10:30 AM</TableCell>
                  <TableCell>Usuario123</TableCell>
                  <TableCell>Actualización de Configuración</TableCell>
                  <TableCell>Modo Oscuro: Activado</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15 de Febrero, 2024 11:00 AM</TableCell>
                  <TableCell>Usuario123</TableCell>
                  <TableCell>Actualización de Configuración</TableCell>
                  <TableCell>Idioma: Español (Perú)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>15 de Febrero, 2024 11:30 AM</TableCell>
                  <TableCell>Usuario123</TableCell>
                  <TableCell>Actualización de Configuración</TableCell>
                  <TableCell>Formato de Fecha: DD/MM/YYYY</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuditDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
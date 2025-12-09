import { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, CheckCircle, XCircle, Clock, Filter, Eye, Archive, Trash2, Search, TrendingUp, Users, DollarSign, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from './ui/utils';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'crítica' | 'alta' | 'media' | 'baja' | 'informativa';
  category: 'fraude' | 'incumplimiento' | 'anomalía' | 'vencimiento' | 'sistema';
  title: string;
  description: string;
  contributor?: string;
  ruc?: string;
  amount?: number;
  date: string;
  status: 'nueva' | 'revisada' | 'en-proceso' | 'resuelta' | 'descartada';
  priority: number;
  assignedTo?: string;
  source: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'crítica',
    category: 'fraude',
    title: 'Posible fraude en drawback detectado',
    description: 'Sistema de IA detectó patrones irregulares en solicitudes de devolución de drawback. Múltiples documentos con inconsistencias graves.',
    contributor: 'Exportadora Agrícola del Sur SA',
    ruc: '20741852963',
    amount: 3200000,
    date: '2024-02-15T10:30:00',
    status: 'nueva',
    priority: 95,
    source: 'IA Analítica',
  },
  {
    id: '2',
    type: 'alta',
    category: 'incumplimiento',
    title: 'Declaraciones mensuales vencidas',
    description: 'Contribuyente no ha presentado declaraciones de IGV de los últimos 3 meses. Riesgo de multas y sanciones.',
    contributor: 'Corporación Industrial del Norte SAC',
    ruc: '20458796321',
    amount: 575000,
    date: '2024-02-14T15:45:00',
    status: 'en-proceso',
    priority: 85,
    assignedTo: 'María González',
    source: 'Sistema Automático',
  },
  {
    id: '3',
    type: 'alta',
    category: 'anomalía',
    title: 'Incremento repentino en crédito fiscal',
    description: 'Se detectó un aumento del 250% en el uso de crédito fiscal respecto al promedio histórico del contribuyente.',
    contributor: 'Distribuidora Comercial Lima EIRL',
    ruc: '20123456789',
    amount: 285000,
    date: '2024-02-14T09:20:00',
    status: 'revisada',
    priority: 82,
    assignedTo: 'Carlos Méndez',
    source: 'Motor de Reglas',
  },
  {
    id: '4',
    type: 'media',
    category: 'vencimiento',
    title: 'Próximo vencimiento de declaración anual',
    description: 'Recordatorio: Declaración anual de renta vence en 15 días. Contribuyente históricamente presenta fuera de plazo.',
    contributor: 'Inversiones Tecnológicas SAA',
    ruc: '20987654321',
    date: '2024-02-13T08:00:00',
    status: 'nueva',
    priority: 60,
    source: 'Sistema Automático',
  },
  {
    id: '5',
    type: 'crítica',
    category: 'anomalía',
    title: 'Transacciones con proveedores de alto riesgo',
    description: 'Detectadas múltiples operaciones comerciales con empresas identificadas como fachada. Total de operaciones sospechosas: S/. 1.2M',
    contributor: 'Constructora Megaproyectos SAC',
    ruc: '20369258147',
    amount: 1200000,
    date: '2024-02-12T16:30:00',
    status: 'en-proceso',
    priority: 92,
    assignedTo: 'Roberto Silva',
    source: 'IA Analítica',
  },
  {
    id: '6',
    type: 'alta',
    category: 'incumplimiento',
    title: 'Libros electrónicos no enviados',
    description: 'No se han recibido los libros contables electrónicos del periodo enero 2024. Incumplimiento de obligación formal.',
    contributor: 'Comercializadora del Centro SA',
    ruc: '20159753486',
    date: '2024-02-12T11:15:00',
    status: 'nueva',
    priority: 78,
    source: 'Sistema Automático',
  },
  {
    id: '7',
    type: 'media',
    category: 'anomalía',
    title: 'Variación atípica en gastos deducibles',
    description: 'Los gastos deducibles declarados superan en 180% el promedio del sector para empresas de tamaño similar.',
    contributor: 'Servicios Logísticos Express EIRL',
    ruc: '20258963147',
    amount: 450000,
    date: '2024-02-11T14:20:00',
    status: 'revisada',
    priority: 65,
    assignedTo: 'Ana Torres',
    source: 'Motor de Reglas',
  },
  {
    id: '8',
    type: 'baja',
    category: 'sistema',
    title: 'Actualización de información tributaria',
    description: 'Contribuyente actualizó su domicilio fiscal y representante legal. Verificar consistencia de datos.',
    contributor: 'Tecnología Digital Peru SAC',
    ruc: '20357951258',
    date: '2024-02-11T10:00:00',
    status: 'resuelta',
    priority: 30,
    assignedTo: 'Pedro Ramírez',
    source: 'Sistema de Registro',
  },
  {
    id: '9',
    type: 'alta',
    category: 'fraude',
    title: 'Facturas electrónicas con datos inconsistentes',
    description: 'Detectadas 47 facturas con números de serie duplicados y fechas de emisión irregulares en el último mes.',
    contributor: 'Importaciones Globales SAC',
    ruc: '20456789123',
    amount: 820000,
    date: '2024-02-10T16:45:00',
    status: 'en-proceso',
    priority: 88,
    assignedTo: 'María González',
    source: 'Validador de Comprobantes',
  },
  {
    id: '10',
    type: 'informativa',
    category: 'sistema',
    title: 'Nuevo contribuyente de alto volumen registrado',
    description: 'Se registró nuevo contribuyente con ingresos proyectados superiores a S/. 10M anuales. Requiere clasificación de riesgo.',
    contributor: 'Minera Andina Internacional SA',
    ruc: '20789456123',
    date: '2024-02-10T09:30:00',
    status: 'nueva',
    priority: 50,
    source: 'Sistema de Registro',
  },
  {
    id: '11',
    type: 'media',
    category: 'vencimiento',
    title: 'Próximo vencimiento de fraccionamiento',
    description: 'Cuota de fraccionamiento tributario vence en 5 días. Historial de pagos indica riesgo de incumplimiento.',
    contributor: 'Textil Fashion Group EIRL',
    ruc: '20147258369',
    amount: 125000,
    date: '2024-02-09T08:15:00',
    status: 'revisada',
    priority: 68,
    assignedTo: 'Carlos Méndez',
    source: 'Sistema de Cobranzas',
  },
  {
    id: '12',
    type: 'crítica',
    category: 'fraude',
    title: 'Empresa fachada detectada en red de facturación',
    description: 'IA identificó empresa como parte de red de facturación falsa. Emitió facturas por S/. 5.8M sin respaldo real de operaciones.',
    contributor: 'Servicios Múltiples del Norte EIRL',
    ruc: '20963852741',
    amount: 5800000,
    date: '2024-02-08T13:20:00',
    status: 'nueva',
    priority: 98,
    source: 'IA Analítica - Red de Grafos',
  },
];

const typeConfig = {
  'crítica': { color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle, iconColor: 'text-red-600' },
  'alta': { color: 'bg-orange-100 text-orange-800 border-orange-300', icon: AlertTriangle, iconColor: 'text-orange-600' },
  'media': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertCircle, iconColor: 'text-yellow-600' },
  'baja': { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Bell, iconColor: 'text-blue-600' },
  'informativa': { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: Bell, iconColor: 'text-gray-600' },
};

const statusConfig = {
  'nueva': { label: 'Nueva', color: 'bg-blue-100 text-blue-800' },
  'revisada': { label: 'Revisada', color: 'bg-purple-100 text-purple-800' },
  'en-proceso': { label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800' },
  'resuelta': { label: 'Resuelta', color: 'bg-green-100 text-green-800' },
  'descartada': { label: 'Descartada', color: 'bg-gray-100 text-gray-800' },
};

const categoryLabels = {
  'fraude': 'Fraude',
  'incumplimiento': 'Incumplimiento',
  'anomalía': 'Anomalía',
  'vencimiento': 'Vencimiento',
  'sistema': 'Sistema',
};

export default function AlertsPage() {
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.contributor && a.contributor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.ruc && a.ruc.includes(searchTerm));
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'nuevas' && a.status === 'nueva') ||
      (activeTab === 'proceso' && a.status === 'en-proceso') ||
      (activeTab === 'resueltas' && a.status === 'resuelta');

    return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesTab;
  }).sort((a, b) => b.priority - a.priority);

  const stats = {
    total: alerts.length,
    nuevas: alerts.filter(a => a.status === 'nueva').length,
    enProceso: alerts.filter(a => a.status === 'en-proceso').length,
    críticas: alerts.filter(a => a.type === 'crítica').length,
  };

  const handleViewDetails = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailOpen(true);
  };

  const handleMarkAsReviewed = (alert: Alert) => {
    toast.success('Alerta marcada como revisada');
  };

  const handleAssignAlert = (alert: Alert) => {
    toast.success('Alerta asignada exitosamente');
  };

  const handleArchiveAlert = (alert: Alert) => {
    toast.success('Alerta archivada');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#003876]">Centro de Alertas Tributarias</h1>
          <p className="text-gray-600">Monitoreo y gestión de alertas del sistema de fiscalización</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Archive className="w-4 h-4 mr-2" />
            Archivadas
          </Button>
          <Button className="bg-[#003876] hover:bg-[#002555]">
            <CheckCircle className="w-4 h-4 mr-2" />
            Marcar todas como leídas
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Alertas</p>
                <p className="text-[#003876]">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-[#003876]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Nuevas</p>
                <p className="text-blue-600">{stats.nuevas}</p>
              </div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">En Proceso</p>
                <p className="text-yellow-600">{stats.enProceso}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Críticas</p>
                <p className="text-red-600">{stats.críticas}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar alertas por título, empresa o RUC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="crítica">Crítica</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
                <SelectItem value="informativa">Informativa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="fraude">Fraude</SelectItem>
                <SelectItem value="incumplimiento">Incumplimiento</SelectItem>
                <SelectItem value="anomalía">Anomalía</SelectItem>
                <SelectItem value="vencimiento">Vencimiento</SelectItem>
                <SelectItem value="sistema">Sistema</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="nueva">Nueva</SelectItem>
                <SelectItem value="revisada">Revisada</SelectItem>
                <SelectItem value="en-proceso">En Proceso</SelectItem>
                <SelectItem value="resuelta">Resuelta</SelectItem>
                <SelectItem value="descartada">Descartada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Todas ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="nuevas">
            Nuevas ({stats.nuevas})
          </TabsTrigger>
          <TabsTrigger value="proceso">
            En Proceso ({stats.enProceso})
          </TabsTrigger>
          <TabsTrigger value="resueltas">
            Resueltas ({alerts.filter(a => a.status === 'resuelta').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Activas ({filteredAlerts.length})</CardTitle>
              <CardDescription>Ordenadas por prioridad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAlerts.map((alert) => {
                  const TypeIcon = typeConfig[alert.type].icon;
                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-4 border-l-4 rounded-lg hover:bg-gray-50 transition-all cursor-pointer",
                        typeConfig[alert.type].color
                      )}
                      onClick={() => handleViewDetails(alert)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <TypeIcon className={cn("w-6 h-6 mt-1", typeConfig[alert.type].iconColor)} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-[#003876]">{alert.title}</h3>
                              <Badge className={typeConfig[alert.type].color}>
                                {alert.type.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">
                                {categoryLabels[alert.category]}
                              </Badge>
                              <Badge className={statusConfig[alert.status].color}>
                                {statusConfig[alert.status].label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {alert.contributor && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {alert.contributor}
                                </span>
                              )}
                              {alert.ruc && (
                                <span className="font-mono">RUC: {alert.ruc}</span>
                              )}
                              {alert.amount && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  S/. {alert.amount.toLocaleString()}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(alert.date).toLocaleString('es-PE', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {alert.source}
                              </span>
                            </div>
                            {alert.assignedTo && (
                              <div className="mt-2 text-sm text-gray-600">
                                Asignado a: <span className="text-[#003876]">{alert.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(alert);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {alert.status === 'nueva' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsReviewed(alert);
                              }}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveAlert(alert);
                            }}
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          {selectedAlert && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {(() => {
                    const Icon = typeConfig[selectedAlert.type].icon;
                    return <Icon className={cn("w-6 h-6", typeConfig[selectedAlert.type].iconColor)} />;
                  })()}
                  <span>{selectedAlert.title}</span>
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={typeConfig[selectedAlert.type].color}>
                      {selectedAlert.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {categoryLabels[selectedAlert.category]}
                    </Badge>
                    <Badge className={statusConfig[selectedAlert.status].color}>
                      {statusConfig[selectedAlert.status].label}
                    </Badge>
                    <Badge variant="secondary">
                      Prioridad: {selectedAlert.priority}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm text-gray-600 mb-2">Descripción</h4>
                  <p className="text-sm">{selectedAlert.description}</p>
                </div>

                {selectedAlert.contributor && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-600 mb-1">Contribuyente</h4>
                      <p className="text-sm text-[#003876]">{selectedAlert.contributor}</p>
                    </div>
                    {selectedAlert.ruc && (
                      <div>
                        <h4 className="text-sm text-gray-600 mb-1">RUC</h4>
                        <p className="text-sm font-mono">{selectedAlert.ruc}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedAlert.amount && (
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Monto Involucrado</h4>
                    <p className="text-xl text-[#003876]">S/. {selectedAlert.amount.toLocaleString()}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Fecha y Hora</h4>
                    <p className="text-sm">
                      {new Date(selectedAlert.date).toLocaleString('es-PE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Fuente</h4>
                    <p className="text-sm">{selectedAlert.source}</p>
                  </div>
                </div>

                {selectedAlert.assignedTo && (
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Asignado a</h4>
                    <p className="text-sm text-[#003876]">{selectedAlert.assignedTo}</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="text-sm text-gray-600 mb-3">Acciones Recomendadas</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Revisar documentación del contribuyente</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Iniciar proceso de fiscalización si corresponde</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Notificar al contribuyente para aclaraciones</span>
                    </li>
                  </ul>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Cerrar
                </Button>
                <Button variant="outline" onClick={() => handleAssignAlert(selectedAlert)}>
                  Asignar
                </Button>
                <Button className="bg-[#003876] hover:bg-[#002555]">
                  <FileText className="w-4 h-4 mr-2" />
                  Crear Caso
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
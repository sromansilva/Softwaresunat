import { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit2, Trash2, Download, Clock, User, AlertTriangle, CheckCircle, XCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { cn } from './ui/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Case {
  id: string;
  number: string;
  company: string;
  ruc: string;
  type: string;
  status: 'abierto' | 'en-proceso' | 'cerrado' | 'suspendido';
  priority: 'alta' | 'media' | 'baja';
  auditor: string;
  openDate: string;
  closeDate?: string;
  amount: number;
  description: string;
  findings: number;
  activities: Activity[];
}

interface Activity {
  id: string;
  date: string;
  user: string;
  action: string;
  description: string;
}

const mockCases: Case[] = [
  {
    id: '1',
    number: 'FIS-2024-001234',
    company: 'Corporación Industrial del Norte SAC',
    ruc: '20458796321',
    type: 'Renta',
    status: 'en-proceso',
    priority: 'alta',
    auditor: 'María González',
    openDate: '2024-01-15',
    amount: 2500000,
    description: 'Inconsistencias en declaración de gastos deducibles y posible evasión tributaria',
    findings: 8,
    activities: [
      { id: '1', date: '2024-01-15', user: 'María González', action: 'Apertura de caso', description: 'Caso abierto por detección de anomalías en declaración mensual' },
      { id: '2', date: '2024-01-20', user: 'María González', action: 'Requerimiento emitido', description: 'Solicitada documentación contable de los últimos 12 meses' },
      { id: '3', date: '2024-02-05', user: 'Pedro Ramírez', action: 'Documentación recibida', description: 'Contribuyente entregó 80% de documentación solicitada' },
      { id: '4', date: '2024-02-10', user: 'María González', action: 'Hallazgo registrado', description: 'Detectadas facturas por S/. 500,000 sin respaldo' },
    ]
  },
  {
    id: '2',
    number: 'FIS-2024-001198',
    company: 'Distribuidora Comercial Lima EIRL',
    ruc: '20123456789',
    type: 'IGV',
    status: 'abierto',
    priority: 'media',
    auditor: 'Carlos Méndez',
    openDate: '2024-02-01',
    amount: 850000,
    description: 'Posible uso indebido de crédito fiscal',
    findings: 3,
    activities: [
      { id: '1', date: '2024-02-01', user: 'Carlos Méndez', action: 'Apertura de caso', description: 'Alerta automática por patrones irregulares en crédito fiscal' },
      { id: '2', date: '2024-02-08', user: 'Carlos Méndez', action: 'Requerimiento emitido', description: 'Solicitud de comprobantes de pago y registro de compras' },
    ]
  },
  {
    id: '3',
    number: 'FIS-2024-000987',
    company: 'Inversiones Tecnológicas SAA',
    ruc: '20987654321',
    type: 'Renta',
    status: 'cerrado',
    priority: 'baja',
    auditor: 'Ana Torres',
    openDate: '2023-10-05',
    closeDate: '2024-01-20',
    amount: 450000,
    description: 'Verificación de deducciones por depreciación',
    findings: 1,
    activities: [
      { id: '1', date: '2023-10-05', user: 'Ana Torres', action: 'Apertura de caso', description: 'Fiscalización de rutina' },
      { id: '2', date: '2023-11-15', user: 'Ana Torres', action: 'Documentación recibida', description: 'Contribuyente entregó toda la documentación' },
      { id: '3', date: '2024-01-10', user: 'Ana Torres', action: 'Hallazgo resuelto', description: 'Contribuyente regularizó observación' },
      { id: '4', date: '2024-01-20', user: 'Ana Torres', action: 'Caso cerrado', description: 'Cierre sin multas ni reparos' },
    ]
  },
  {
    id: '4',
    number: 'FIS-2024-001456',
    company: 'Exportadora Agrícola del Sur SA',
    ruc: '20741852963',
    type: 'Drawback',
    status: 'suspendido',
    priority: 'alta',
    auditor: 'Roberto Silva',
    openDate: '2024-01-25',
    amount: 3200000,
    description: 'Investigación de posible fraude en solicitudes de devolución',
    findings: 12,
    activities: [
      { id: '1', date: '2024-01-25', user: 'Roberto Silva', action: 'Apertura de caso', description: 'Caso abierto por alerta de inteligencia tributaria' },
      { id: '2', date: '2024-02-01', user: 'Roberto Silva', action: 'Medida cautelar', description: 'Suspensión temporal de devoluciones' },
      { id: '3', date: '2024-02-15', user: 'Legal SUNAT', action: 'Caso suspendido', description: 'En espera de resolución judicial' },
    ]
  },
  {
    id: '5',
    number: 'FIS-2024-001589',
    company: 'Constructora Megaproyectos SAC',
    ruc: '20369258147',
    type: 'Renta',
    status: 'en-proceso',
    priority: 'media',
    auditor: 'María González',
    openDate: '2024-02-10',
    amount: 1800000,
    description: 'Revisión de contratos de construcción y centro de costos',
    findings: 5,
    activities: [
      { id: '1', date: '2024-02-10', user: 'María González', action: 'Apertura de caso', description: 'Fiscalización programada anual' },
      { id: '2', date: '2024-02-18', user: 'María González', action: 'Inspección realizada', description: 'Visita a obra en San Isidro' },
    ]
  },
];

const statusConfig = {
  'abierto': { label: 'Abierto', color: 'bg-blue-100 text-blue-800', icon: Circle },
  'en-proceso': { label: 'En Proceso', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'cerrado': { label: 'Cerrado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'suspendido': { label: 'Suspendido', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const priorityConfig = {
  'alta': { label: 'Alta', color: 'bg-red-100 text-red-800' },
  'media': { label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  'baja': { label: 'Baja', color: 'bg-gray-100 text-gray-800' },
};

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Case>>({});

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ruc.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: cases.length,
    abiertos: cases.filter(c => c.status === 'abierto').length,
    enProceso: cases.filter(c => c.status === 'en-proceso').length,
    cerrados: cases.filter(c => c.status === 'cerrado').length,
    suspendidos: cases.filter(c => c.status === 'suspendido').length,
  };

  const handleViewDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsDetailOpen(true);
  };

  const handleEditCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setEditFormData(caseItem);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedCase && editFormData) {
      const updatedCases = cases.map(c => c.id === selectedCase.id ? { ...c, ...editFormData } : c);
      setCases(updatedCases);
      setIsEditOpen(false);
    }
  };

  const handleDownloadPDF = (caseItem: Case) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header with SUNAT branding
    doc.setFillColor(0, 56, 118); // #003876
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('SUNAT', 15, 15);
    doc.setFontSize(12);
    doc.text('Superintendencia Nacional de Aduanas y de Administración Tributaria', 15, 23);
    doc.setFontSize(10);
    doc.text('Reporte de Caso de Fiscalización', 15, 30);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Case Number Header
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 45, pageWidth - 30, 15, 'F');
    doc.setFontSize(14);
    doc.setTextColor(0, 56, 118);
    doc.text(`Caso: ${caseItem.number}`, 20, 55);

    doc.setTextColor(0, 0, 0);

    // Status badge
    let statusColor: [number, number, number] = [200, 200, 200];
    if (caseItem.status === 'abierto') statusColor = [59, 130, 246];
    else if (caseItem.status === 'en-proceso') statusColor = [234, 179, 8];
    else if (caseItem.status === 'cerrado') statusColor = [34, 197, 94];
    else if (caseItem.status === 'suspendido') statusColor = [239, 68, 68];

    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(pageWidth - 60, 47, 45, 11, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(statusConfig[caseItem.status].label, pageWidth - 57, 54);

    doc.setTextColor(0, 0, 0);

    // Information Section
    let yPos = 70;

    // Section: Información del Contribuyente
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('INFORMACIÓN DEL CONTRIBUYENTE', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);

    yPos += 15;
    doc.setFontSize(10);
    doc.text('Razón Social:', 20, yPos);
    doc.text(caseItem.company, 70, yPos);

    yPos += 7;
    doc.text('RUC:', 20, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(caseItem.ruc, 70, yPos);
    doc.setFont('helvetica', 'normal');

    // Section: Detalles del Caso
    yPos += 12;
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('DETALLES DEL CASO', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);

    yPos += 15;
    doc.setFontSize(10);

    const leftCol = 20;
    const rightCol = 110;

    doc.text('Tipo de Fiscalización:', leftCol, yPos);
    doc.text(caseItem.type, leftCol + 50, yPos);

    doc.text('Prioridad:', rightCol, yPos);
    const priorityLabel = priorityConfig[caseItem.priority].label;
    doc.setTextColor(caseItem.priority === 'alta' ? 239 : caseItem.priority === 'media' ? 234 : 100,
      caseItem.priority === 'alta' ? 68 : caseItem.priority === 'media' ? 179 : 100,
      caseItem.priority === 'alta' ? 68 : 8);
    doc.text(priorityLabel, rightCol + 22, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 7;
    doc.text('Auditor Asignado:', leftCol, yPos);
    doc.text(caseItem.auditor, leftCol + 50, yPos);

    doc.text('Hallazgos:', rightCol, yPos);
    doc.setTextColor(caseItem.findings > 0 ? 239 : 100, caseItem.findings > 0 ? 68 : 100, 68);
    doc.text(`${caseItem.findings}`, rightCol + 22, yPos);
    doc.setTextColor(0, 0, 0);

    yPos += 7;
    doc.text('Fecha Apertura:', leftCol, yPos);
    doc.text(new Date(caseItem.openDate).toLocaleDateString('es-PE'), leftCol + 50, yPos);

    if (caseItem.closeDate) {
      doc.text('Fecha Cierre:', rightCol, yPos);
      doc.text(new Date(caseItem.closeDate).toLocaleDateString('es-PE'), rightCol + 22, yPos);
      yPos += 7;
    } else {
      yPos += 7;
    }

    doc.text('Monto en Revisión:', leftCol, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 56, 118);
    doc.text(`S/. ${caseItem.amount.toLocaleString('es-PE')}`, leftCol + 50, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    // Description Section
    yPos += 12;
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('DESCRIPCIÓN', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);

    yPos += 12;
    doc.setFontSize(9);
    const descriptionLines = doc.splitTextToSize(caseItem.description, pageWidth - 50);
    doc.text(descriptionLines, 20, yPos);

    // Activities Timeline Table
    yPos += descriptionLines.length * 5 + 10;

    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('LÍNEA DE TIEMPO DE ACTIVIDADES', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);

    yPos += 12;

    // Use autoTable for activities
    autoTable(doc as any, {
      startY: yPos,
      head: [['Fecha', 'Acción', 'Descripción', 'Usuario']],
      body: caseItem.activities.map(activity => [
        new Date(activity.date).toLocaleDateString('es-PE'),
        activity.action,
        activity.description,
        activity.user
      ]),
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [0, 56, 118],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [60, 60, 60]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 35 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 35 }
      },
      theme: 'striped'
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')} a las ${new Date().toLocaleTimeString('es-PE')}`, 15, pageHeight - 12);
    doc.text('SUNAT - Sistema de Fiscalización Inteligente', 15, pageHeight - 7);
    doc.text(`Página 1`, pageWidth - 25, pageHeight - 10);

    // Save the PDF
    doc.save(`Caso_${caseItem.number}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#003876]">Gestión de Casos de Fiscalización</h1>
          <p className="text-gray-600">Administra y supervisa todos los casos tributarios</p>
        </div>
        <Button onClick={() => setIsNewCaseOpen(true)} className="bg-[#003876] hover:bg-[#002555]">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Caso
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Casos</p>
                <p className="text-[#003876]">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#003876]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Abiertos</p>
                <p className="text-blue-600">{stats.abiertos}</p>
              </div>
              <Circle className="w-6 h-6 text-blue-600" />
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
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Cerrados</p>
                <p className="text-green-600">{stats.cerrados}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Suspendidos</p>
                <p className="text-red-600">{stats.suspendidos}</p>
              </div>
              <XCircle className="w-6 h-6 text-red-600" />
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
                placeholder="Buscar por empresa, RUC o número de caso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="abierto">Abierto</SelectItem>
                <SelectItem value="en-proceso">En Proceso</SelectItem>
                <SelectItem value="cerrado">Cerrado</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Casos Registrados ({filteredCases.length})</CardTitle>
          <CardDescription>Lista completa de casos de fiscalización</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600">Nº Caso</th>
                  <th className="text-left py-3 px-4 text-gray-600">Empresa</th>
                  <th className="text-left py-3 px-4 text-gray-600">RUC</th>
                  <th className="text-left py-3 px-4 text-gray-600">Tipo</th>
                  <th className="text-left py-3 px-4 text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 text-gray-600">Prioridad</th>
                  <th className="text-left py-3 px-4 text-gray-600">Auditor</th>
                  <th className="text-left py-3 px-4 text-gray-600">Monto</th>
                  <th className="text-left py-3 px-4 text-gray-600">Hallazgos</th>
                  <th className="text-left py-3 px-4 text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((caseItem) => {
                  const StatusIcon = statusConfig[caseItem.status].icon;
                  return (
                    <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="text-[#003876]">{caseItem.number}</span>
                      </td>
                      <td className="py-3 px-4">{caseItem.company}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{caseItem.ruc}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{caseItem.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig[caseItem.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[caseItem.status].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={priorityConfig[caseItem.priority].color}>
                          {priorityConfig[caseItem.priority].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{caseItem.auditor}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span>S/. {caseItem.amount.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={caseItem.findings > 0 ? "destructive" : "secondary"}>
                          {caseItem.findings}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(caseItem)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCase(caseItem)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPDF(caseItem)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Case Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Caso {selectedCase.number}</span>
                  <Badge className={statusConfig[selectedCase.status].color}>
                    {statusConfig[selectedCase.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>{selectedCase.company}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>RUC</Label>
                      <p className="font-mono">{selectedCase.ruc}</p>
                    </div>
                    <div>
                      <Label>Tipo de Fiscalización</Label>
                      <p>{selectedCase.type}</p>
                    </div>
                    <div>
                      <Label>Prioridad</Label>
                      <Badge className={priorityConfig[selectedCase.priority].color}>
                        {priorityConfig[selectedCase.priority].label}
                      </Badge>
                    </div>
                    <div>
                      <Label>Auditor Asignado</Label>
                      <p>{selectedCase.auditor}</p>
                    </div>
                    <div>
                      <Label>Fecha de Apertura</Label>
                      <p>{new Date(selectedCase.openDate).toLocaleDateString('es-PE')}</p>
                    </div>
                    {selectedCase.closeDate && (
                      <div>
                        <Label>Fecha de Cierre</Label>
                        <p>{new Date(selectedCase.closeDate).toLocaleDateString('es-PE')}</p>
                      </div>
                    )}
                    <div>
                      <Label>Monto en Revisión</Label>
                      <p>S/. {selectedCase.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Hallazgos Detectados</Label>
                      <Badge variant={selectedCase.findings > 0 ? "destructive" : "secondary"}>
                        {selectedCase.findings} hallazgos
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Descripción del Caso</Label>
                    <p className="text-gray-700 mt-2">{selectedCase.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-4">
                  <div className="space-y-4">
                    {selectedCase.activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            index === 0 ? "bg-[#003876]" : "bg-gray-200"
                          )}>
                            <Circle className={cn("w-4 h-4", index === 0 ? "text-white" : "text-gray-500")} />
                          </div>
                          {index < selectedCase.activities.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#003876]">{activity.action}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(activity.date).toLocaleDateString('es-PE')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{activity.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <p>Sistema de gestión documental en desarrollo</p>
                    <p className="text-sm">Próximamente podrás ver y gestionar documentos del caso</p>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  className="bg-[#003876] hover:bg-[#002555]"
                  onClick={() => {
                    setIsDetailOpen(false);
                    handleEditCase(selectedCase);
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Caso
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Case Dialog */}
      <Dialog open={isNewCaseOpen} onOpenChange={setIsNewCaseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Caso de Fiscalización</DialogTitle>
            <DialogDescription>
              Complete la información para registrar un nuevo caso
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Razón Social</Label>
                <Input id="company" placeholder="Empresa SAC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input id="ruc" placeholder="20123456789" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Fiscalización</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renta">Renta</SelectItem>
                    <SelectItem value="igv">IGV</SelectItem>
                    <SelectItem value="drawback">Drawback</SelectItem>
                    <SelectItem value="essalud">EsSalud</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auditor">Auditor Asignado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar auditor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maria">María González</SelectItem>
                    <SelectItem value="carlos">Carlos Méndez</SelectItem>
                    <SelectItem value="ana">Ana Torres</SelectItem>
                    <SelectItem value="roberto">Roberto Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto en Revisión (S/.)</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Caso</Label>
              <Textarea
                id="description"
                placeholder="Detalle las razones y observaciones iniciales..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCaseOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#003876] hover:bg-[#002555]">
              Crear Caso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Case Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Caso de Fiscalización</DialogTitle>
            <DialogDescription>
              Actualiza la información del caso
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Razón Social</Label>
                <Input
                  id="company"
                  placeholder="Empresa SAC"
                  value={editFormData.company || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  placeholder="20123456789"
                  value={editFormData.ruc || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, ruc: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Fiscalización</Label>
                <Select
                  value={editFormData.type || ''}
                  onValueChange={(value) => setEditFormData({ ...editFormData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="renta">Renta</SelectItem>
                    <SelectItem value="igv">IGV</SelectItem>
                    <SelectItem value="drawback">Drawback</SelectItem>
                    <SelectItem value="essalud">EsSalud</SelectItem>
                    <SelectItem value="otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={editFormData.priority || ''}
                  onValueChange={(value) => setEditFormData({ ...editFormData, priority: value as Case['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auditor">Auditor Asignado</Label>
                <Select
                  value={editFormData.auditor || ''}
                  onValueChange={(value) => setEditFormData({ ...editFormData, auditor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar auditor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maria">María González</SelectItem>
                    <SelectItem value="carlos">Carlos Méndez</SelectItem>
                    <SelectItem value="ana">Ana Torres</SelectItem>
                    <SelectItem value="roberto">Roberto Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Monto en Revisión (S/.)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={editFormData.amount?.toString() || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Caso</Label>
              <Textarea
                id="description"
                placeholder="Detalle las razones y observaciones iniciales..."
                rows={4}
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#003876] hover:bg-[#002555]" onClick={handleSaveEdit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
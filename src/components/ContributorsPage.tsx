import { useState } from 'react';
import { Search, Filter, Users, Building2, AlertTriangle, TrendingUp, Eye, Download, MapPin, Phone, Mail, Calendar, FileText, Activity, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

interface Contributor {
  id: string;
  ruc: string;
  companyName: string;
  tradeName: string;
  legalRep: string;
  sector: string;
  size: 'micro' | 'pequeña' | 'mediana' | 'grande';
  riskLevel: 'bajo' | 'medio' | 'alto' | 'crítico';
  riskScore: number;
  status: 'activo' | 'suspendido' | 'baja';
  address: string;
  district: string;
  phone: string;
  email: string;
  registrationDate: string;
  lastDeclaration: string;
  monthlyAvgRevenue: number;
  totalTaxes: number;
  openCases: number;
  historicalCases: number;
  complianceRate: number;
  paymentHistory: Array<{ month: string; amount: number; status: string }>;
  declarations: Array<{ month: string; revenue: number; taxes: number }>;
  flags: string[];
}

const mockContributors: Contributor[] = [
  {
    id: '1',
    ruc: '20458796321',
    companyName: 'Corporación Industrial del Norte SAC',
    tradeName: 'CINOR SAC',
    legalRep: 'Juan Carlos Mendoza Vera',
    sector: 'Manufactura',
    size: 'grande',
    riskLevel: 'alto',
    riskScore: 78,
    status: 'activo',
    address: 'Av. Industrial 4567',
    district: 'Los Olivos',
    phone: '(01) 485-7963',
    email: 'contacto@cinor.pe',
    registrationDate: '2015-03-15',
    lastDeclaration: '2024-02-10',
    monthlyAvgRevenue: 2500000,
    totalTaxes: 15800000,
    openCases: 2,
    historicalCases: 5,
    complianceRate: 65,
    paymentHistory: [
      { month: 'Ago', amount: 180000, status: 'pagado' },
      { month: 'Sep', amount: 175000, status: 'pagado' },
      { month: 'Oct', amount: 190000, status: 'pagado' },
      { month: 'Nov', amount: 185000, status: 'atrasado' },
      { month: 'Dic', amount: 195000, status: 'atrasado' },
      { month: 'Ene', amount: 200000, status: 'pendiente' },
    ],
    declarations: [
      { month: 'Ago', revenue: 2300000, taxes: 180000 },
      { month: 'Sep', revenue: 2200000, taxes: 175000 },
      { month: 'Oct', revenue: 2450000, taxes: 190000 },
      { month: 'Nov', revenue: 2350000, taxes: 185000 },
      { month: 'Dic', revenue: 2500000, taxes: 195000 },
      { month: 'Ene', revenue: 2600000, taxes: 200000 },
    ],
    flags: ['Inconsistencias en gastos', 'Retraso en pagos', 'Crédito fiscal irregular']
  },
  {
    id: '2',
    ruc: '20123456789',
    companyName: 'Distribuidora Comercial Lima EIRL',
    tradeName: 'Distrimax',
    legalRep: 'María Elena Sánchez Torres',
    sector: 'Comercio',
    size: 'mediana',
    riskLevel: 'medio',
    riskScore: 52,
    status: 'activo',
    address: 'Jr. Comercio 234',
    district: 'La Victoria',
    phone: '(01) 321-4567',
    email: 'info@distrimax.pe',
    registrationDate: '2018-07-22',
    lastDeclaration: '2024-02-15',
    monthlyAvgRevenue: 850000,
    totalTaxes: 4200000,
    openCases: 1,
    historicalCases: 2,
    complianceRate: 85,
    paymentHistory: [
      { month: 'Ago', amount: 68000, status: 'pagado' },
      { month: 'Sep', amount: 65000, status: 'pagado' },
      { month: 'Oct', amount: 70000, status: 'pagado' },
      { month: 'Nov', amount: 72000, status: 'pagado' },
      { month: 'Dic', amount: 75000, status: 'pagado' },
      { month: 'Ene', amount: 78000, status: 'pagado' },
    ],
    declarations: [
      { month: 'Ago', revenue: 850000, taxes: 68000 },
      { month: 'Sep', revenue: 820000, taxes: 65000 },
      { month: 'Oct', revenue: 880000, taxes: 70000 },
      { month: 'Nov', revenue: 900000, taxes: 72000 },
      { month: 'Dic', revenue: 940000, taxes: 75000 },
      { month: 'Ene', revenue: 970000, taxes: 78000 },
    ],
    flags: ['Uso de crédito fiscal a revisar']
  },
  {
    id: '3',
    ruc: '20987654321',
    companyName: 'Inversiones Tecnológicas SAA',
    tradeName: 'InverTech',
    legalRep: 'Roberto Silva Paredes',
    sector: 'Tecnología',
    size: 'mediana',
    riskLevel: 'bajo',
    riskScore: 25,
    status: 'activo',
    address: 'Av. República de Panamá 5234',
    district: 'Surco',
    phone: '(01) 612-8945',
    email: 'contacto@invertech.pe',
    registrationDate: '2019-11-08',
    lastDeclaration: '2024-02-12',
    monthlyAvgRevenue: 1200000,
    totalTaxes: 5600000,
    openCases: 0,
    historicalCases: 1,
    complianceRate: 98,
    paymentHistory: [
      { month: 'Ago', amount: 96000, status: 'pagado' },
      { month: 'Sep', amount: 94000, status: 'pagado' },
      { month: 'Oct', amount: 98000, status: 'pagado' },
      { month: 'Nov', amount: 100000, status: 'pagado' },
      { month: 'Dic', amount: 102000, status: 'pagado' },
      { month: 'Ene', amount: 105000, status: 'pagado' },
    ],
    declarations: [
      { month: 'Ago', revenue: 1200000, taxes: 96000 },
      { month: 'Sep', revenue: 1180000, taxes: 94000 },
      { month: 'Oct', revenue: 1220000, taxes: 98000 },
      { month: 'Nov', revenue: 1250000, taxes: 100000 },
      { month: 'Dic', revenue: 1280000, taxes: 102000 },
      { month: 'Ene', revenue: 1320000, taxes: 105000 },
    ],
    flags: []
  },
  {
    id: '4',
    ruc: '20741852963',
    companyName: 'Exportadora Agrícola del Sur SA',
    tradeName: 'Agrosur',
    legalRep: 'Carmen Rosa Huamán Díaz',
    sector: 'Agricultura',
    size: 'grande',
    riskLevel: 'crítico',
    riskScore: 92,
    status: 'suspendido',
    address: 'Carretera Panamericana Sur Km 45',
    district: 'Lurín',
    phone: '(01) 574-8521',
    email: 'exportaciones@agrosur.pe',
    registrationDate: '2012-05-20',
    lastDeclaration: '2024-01-28',
    monthlyAvgRevenue: 3800000,
    totalTaxes: 22400000,
    openCases: 3,
    historicalCases: 8,
    complianceRate: 45,
    paymentHistory: [
      { month: 'Ago', amount: 304000, status: 'pagado' },
      { month: 'Sep', amount: 296000, status: 'atrasado' },
      { month: 'Oct', amount: 310000, status: 'atrasado' },
      { month: 'Nov', amount: 315000, status: 'impago' },
      { month: 'Dic', amount: 320000, status: 'impago' },
      { month: 'Ene', amount: 330000, status: 'impago' },
    ],
    declarations: [
      { month: 'Ago', revenue: 3800000, taxes: 304000 },
      { month: 'Sep', revenue: 3700000, taxes: 296000 },
      { month: 'Oct', revenue: 3900000, taxes: 310000 },
      { month: 'Nov', revenue: 3950000, taxes: 315000 },
      { month: 'Dic', revenue: 4000000, taxes: 320000 },
      { month: 'Ene', revenue: 4100000, taxes: 330000 },
    ],
    flags: ['Fraude potencial en drawback', 'Múltiples impagos', 'Operaciones sospechosas', 'Medida cautelar activa']
  },
  {
    id: '5',
    ruc: '20369258147',
    companyName: 'Constructora Megaproyectos SAC',
    tradeName: 'Megaproyectos',
    legalRep: 'Luis Alberto Ramírez Flores',
    sector: 'Construcción',
    size: 'grande',
    riskLevel: 'medio',
    riskScore: 58,
    status: 'activo',
    address: 'Av. Javier Prado Este 2356',
    district: 'San Isidro',
    phone: '(01) 442-1578',
    email: 'admin@megaproyectos.pe',
    registrationDate: '2016-09-12',
    lastDeclaration: '2024-02-14',
    monthlyAvgRevenue: 4200000,
    totalTaxes: 18900000,
    openCases: 1,
    historicalCases: 4,
    complianceRate: 82,
    paymentHistory: [
      { month: 'Ago', amount: 336000, status: 'pagado' },
      { month: 'Sep', amount: 328000, status: 'pagado' },
      { month: 'Oct', amount: 344000, status: 'pagado' },
      { month: 'Nov', amount: 352000, status: 'pagado' },
      { month: 'Dic', amount: 360000, status: 'pagado' },
      { month: 'Ene', amount: 368000, status: 'atrasado' },
    ],
    declarations: [
      { month: 'Ago', revenue: 4200000, taxes: 336000 },
      { month: 'Sep', revenue: 4100000, taxes: 328000 },
      { month: 'Oct', revenue: 4300000, taxes: 344000 },
      { month: 'Nov', revenue: 4400000, taxes: 352000 },
      { month: 'Dic', revenue: 4500000, taxes: 360000 },
      { month: 'Ene', revenue: 4600000, taxes: 368000 },
    ],
    flags: ['Revisión de centros de costos', 'Facturación irregular']
  },
];

const riskConfig = {
  'bajo': { label: 'Bajo', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'medio': { label: 'Medio', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  'alto': { label: 'Alto', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  'crítico': { label: 'Crítico', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const sizeLabels = {
  'micro': 'Microempresa',
  'pequeña': 'Pequeña',
  'mediana': 'Mediana',
  'grande': 'Gran Empresa',
};

export default function ContributorsPage() {
  const [contributors] = useState<Contributor[]>(mockContributors);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredContributors = contributors.filter(c => {
    const matchesSearch = 
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ruc.includes(searchTerm) ||
      c.tradeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
    const matchesSector = sectorFilter === 'all' || c.sector === sectorFilter;
    return matchesSearch && matchesRisk && matchesSector;
  });

  const stats = {
    total: contributors.length,
    activos: contributors.filter(c => c.status === 'activo').length,
    altoRiesgo: contributors.filter(c => c.riskLevel === 'alto' || c.riskLevel === 'crítico').length,
    conCasosAbiertos: contributors.filter(c => c.openCases > 0).length,
  };

  const sectors = [...new Set(contributors.map(c => c.sector))];

  const handleViewDetails = (contributor: Contributor) => {
    setSelectedContributor(contributor);
    setIsDetailOpen(true);
  };

  const handleGenerateReport = async () => {
    if (!selectedContributor) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 0;

    // === HEADER ===
    doc.setFillColor(0, 56, 118);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('SUNAT', 15, 18);
    doc.setFontSize(11);
    doc.text('Superintendencia Nacional de Aduanas y de Administración Tributaria', 15, 26);
    doc.setFontSize(10);
    doc.text('Reporte de Contribuyente - Análisis Completo', 15, 34);
    
    doc.setTextColor(0, 0, 0);

    // === COMPANY HEADER ===
    yPos = 50;
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos, pageWidth - 30, 20, 'F');
    
    doc.setFontSize(16);
    doc.setTextColor(0, 56, 118);
    doc.text(selectedContributor.companyName, 20, yPos + 8);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${selectedContributor.tradeName} - RUC: ${selectedContributor.ruc}`, 20, yPos + 15);
    
    // Risk Badge
    const riskColors: { [key: string]: [number, number, number] } = {
      'bajo': [34, 197, 94],
      'medio': [234, 179, 8],
      'alto': [249, 115, 22],
      'crítico': [239, 68, 68]
    };
    const riskColor = riskColors[selectedContributor.riskLevel];
    doc.setFillColor(...riskColor);
    doc.roundedRect(pageWidth - 50, yPos + 5, 35, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(`Score: ${selectedContributor.riskScore}`, pageWidth - 48, yPos + 11);
    
    doc.setTextColor(0, 0, 0);

    // === SECCIÓN 1: INFORMACIÓN GENERAL ===
    yPos += 30;
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('1. INFORMACIÓN GENERAL', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    
    yPos += 15;
    doc.setFontSize(9);
    const leftCol = 20;
    const rightCol = 110;
    
    doc.text('Representante Legal:', leftCol, yPos);
    doc.text(selectedContributor.legalRep, leftCol + 38, yPos);
    
    doc.text('Sector:', rightCol, yPos);
    doc.text(selectedContributor.sector, rightCol + 15, yPos);
    
    yPos += 6;
    doc.text('Tamaño de Empresa:', leftCol, yPos);
    doc.text(sizeLabels[selectedContributor.size], leftCol + 38, yPos);
    
    doc.text('Estado:', rightCol, yPos);
    doc.setTextColor(selectedContributor.status === 'activo' ? 34 : 239, selectedContributor.status === 'activo' ? 197 : 68, selectedContributor.status === 'activo' ? 94 : 68);
    doc.text(selectedContributor.status.toUpperCase(), rightCol + 15, yPos);
    doc.setTextColor(0, 0, 0);
    
    yPos += 6;
    doc.text('Dirección:', leftCol, yPos);
    doc.text(`${selectedContributor.address}, ${selectedContributor.district}`, leftCol + 38, yPos);
    
    yPos += 6;
    doc.text('Teléfono:', leftCol, yPos);
    doc.text(selectedContributor.phone, leftCol + 38, yPos);
    
    doc.text('Email:', rightCol, yPos);
    doc.text(selectedContributor.email, rightCol + 15, yPos);
    
    yPos += 6;
    doc.text('Fecha Registro:', leftCol, yPos);
    doc.text(new Date(selectedContributor.registrationDate).toLocaleDateString('es-PE'), leftCol + 38, yPos);
    
    doc.text('Última Declaración:', rightCol, yPos);
    doc.text(new Date(selectedContributor.lastDeclaration).toLocaleDateString('es-PE'), rightCol + 38, yPos);

    // === SECCIÓN 2: INFORMACIÓN FINANCIERA ===
    yPos += 15;
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('2. INFORMACIÓN FINANCIERA', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    
    yPos += 15;
    doc.setFontSize(9);
    
    // Financial Summary Boxes
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(20, yPos, 50, 15, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('Ingreso Mensual Prom.', 22, yPos + 5);
    doc.setFontSize(10);
    doc.text(`S/. ${(selectedContributor.monthlyAvgRevenue / 1000).toFixed(0)}K`, 22, yPos + 11);
    
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(75, yPos, 50, 15, 2, 2, 'F');
    doc.setFontSize(7);
    doc.text('Total Impuestos', 77, yPos + 5);
    doc.setFontSize(10);
    doc.text(`S/. ${(selectedContributor.totalTaxes / 1000).toFixed(0)}K`, 77, yPos + 11);
    
    doc.setFillColor(168, 85, 247);
    doc.roundedRect(130, yPos, 50, 15, 2, 2, 'F');
    doc.setFontSize(7);
    doc.text('Tasa Efectiva', 132, yPos + 5);
    doc.setFontSize(10);
    const efectiveRate = ((selectedContributor.totalTaxes / (selectedContributor.monthlyAvgRevenue * 12)) * 100).toFixed(1);
    doc.text(`${efectiveRate}%`, 132, yPos + 11);
    
    doc.setTextColor(0, 0, 0);
    
    // Declarations Table
    yPos += 22;
    doc.setFontSize(10);
    doc.text('Declaraciones Recientes (Últimos 6 meses):', 20, yPos);
    
    yPos += 5;
    autoTable(doc, {
      startY: yPos,
      head: [['Mes', 'Ingresos (S/.)', 'Impuestos (S/.)', 'Tasa (%)']],
      body: selectedContributor.declarations.map(d => [
        d.month,
        d.revenue.toLocaleString('es-PE'),
        d.taxes.toLocaleString('es-PE'),
        ((d.taxes / d.revenue) * 100).toFixed(2) + '%'
      ]),
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [0, 56, 118],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      theme: 'striped'
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // === SECCIÓN 3: CUMPLIMIENTO TRIBUTARIO ===
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('3. CUMPLIMIENTO TRIBUTARIO', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    
    yPos += 15;
    doc.setFontSize(9);
    
    // Compliance Rate Visual
    const complianceColor: [number, number, number] = selectedContributor.complianceRate >= 80 ? [34, 197, 94] : 
                                                       selectedContributor.complianceRate >= 60 ? [234, 179, 8] : 
                                                       [239, 68, 68];
    
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, 80, 8, 'F');
    doc.setFillColor(...complianceColor);
    doc.rect(20, yPos, (80 * selectedContributor.complianceRate) / 100, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.text(`Tasa de Cumplimiento: ${selectedContributor.complianceRate}%`, 22, yPos + 5.5);
    
    yPos += 15;
    doc.text('Indicadores de Cumplimiento:', 20, yPos);
    yPos += 5;
    
    const complianceMetrics = [
      { label: 'Declaraciones a tiempo', value: '92%' },
      { label: 'Pagos puntuales', value: `${selectedContributor.complianceRate}%` },
      { label: 'Documentación completa', value: '88%' }
    ];
    
    complianceMetrics.forEach(metric => {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, yPos, pageWidth - 40, 7, 'F');
      doc.text(`• ${metric.label}:`, 22, yPos + 5);
      doc.setFont(undefined, 'bold');
      doc.text(metric.value, pageWidth - 40, yPos + 5);
      doc.setFont(undefined, 'normal');
      yPos += 8;
    });
    
    // Payment History Table
    yPos += 5;
    doc.text('Historial de Pagos:', 20, yPos);
    
    yPos += 5;
    autoTable(doc, {
      startY: yPos,
      head: [['Mes', 'Monto (S/.)', 'Estado']],
      body: selectedContributor.paymentHistory.map(p => [
        p.month,
        p.amount.toLocaleString('es-PE'),
        p.status.toUpperCase()
      ]),
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [0, 56, 118],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      theme: 'striped',
      didParseCell: (data: any) => {
        if (data.column.index === 2 && data.section === 'body') {
          const status = selectedContributor.paymentHistory[data.row.index].status;
          if (status === 'pagado') {
            data.cell.styles.textColor = [34, 197, 94];
            data.cell.styles.fontStyle = 'bold';
          } else if (status === 'atrasado') {
            data.cell.styles.textColor = [234, 179, 8];
            data.cell.styles.fontStyle = 'bold';
          } else if (status === 'impago' || status === 'pendiente') {
            data.cell.styles.textColor = [239, 68, 68];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // === SECCIÓN 4: ANÁLISIS DE RIESGO ===
    if (yPos > pageHeight - 70) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('4. ANÁLISIS DE RIESGO', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    
    yPos += 15;
    
    // Risk Score Circle
    const centerX = 50;
    const centerY = yPos + 20;
    const radius = 18;
    
    doc.setFillColor(...riskColor);
    doc.circle(centerX, centerY, radius, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(selectedContributor.riskScore.toString(), centerX, centerY + 2, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Score de Riesgo', centerX, centerY + 25, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(...riskColor);
    doc.text(`Nivel ${riskConfig[selectedContributor.riskLevel].label}`, centerX, centerY + 31, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Nivel de Riesgo: ${riskConfig[selectedContributor.riskLevel].label}`, 80, yPos + 10);
    doc.text('Factores Evaluados:', 80, yPos + 18);
    doc.setFontSize(8);
    doc.text('• Historial de cumplimiento tributario', 82, yPos + 24);
    doc.text('• Consistencia en declaraciones', 82, yPos + 29);
    doc.text('• Patrones de pago', 82, yPos + 34);
    doc.text('• Alertas y señales detectadas', 82, yPos + 39);
    
    yPos += 50;
    
    // Risk Flags
    if (selectedContributor.flags.length > 0) {
      doc.setFontSize(10);
      doc.text('Señales de Alerta Detectadas:', 20, yPos);
      yPos += 5;
      
      selectedContributor.flags.forEach((flag, index) => {
        doc.setFillColor(254, 226, 226);
        doc.rect(20, yPos, pageWidth - 40, 8, 'F');
        doc.setDrawColor(239, 68, 68);
        doc.setLineWidth(2);
        doc.line(20, yPos, 20, yPos + 8);
        doc.setLineWidth(0.2);
        doc.setTextColor(153, 27, 27);
        doc.setFontSize(8);
        doc.text(`⚠ ${flag}`, 25, yPos + 5);
        yPos += 10;
      });
      doc.setTextColor(0, 0, 0);
    } else {
      doc.setFillColor(220, 252, 231);
      doc.rect(20, yPos, pageWidth - 40, 8, 'F');
      doc.setTextColor(21, 128, 61);
      doc.setFontSize(8);
      doc.text('✓ No se han detectado señales de alerta', 25, yPos + 5);
      doc.setTextColor(0, 0, 0);
      yPos += 10;
    }

    // === SECCIÓN 5: HISTORIAL DE CASOS ===
    yPos += 5;
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFillColor(0, 56, 118);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('5. HISTORIAL DE CASOS', 20, yPos + 5.5);
    doc.setTextColor(0, 0, 0);
    
    yPos += 15;
    
    const casosData = [
      ['Total de Casos Históricos', selectedContributor.historicalCases.toString()],
      ['Casos Abiertos', selectedContributor.openCases.toString()],
      ['Casos Cerrados', (selectedContributor.historicalCases - selectedContributor.openCases).toString()],
      ['Tasa de Resolución', `${((1 - selectedContributor.openCases / selectedContributor.historicalCases) * 100).toFixed(0)}%`]
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [['Indicador', 'Valor']],
      body: casosData,
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [0, 56, 118],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      theme: 'striped'
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;

    // === FOOTER ===
    const finalY = yPos;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')} a las ${new Date().toLocaleTimeString('es-PE')}`, 15, pageHeight - 12);
    doc.text('SUNAT - Sistema de Fiscalización Inteligente - Reporte Confidencial', 15, pageHeight - 7);
    doc.text(`Página ${doc.internal.pages.length - 1}`, pageWidth - 25, pageHeight - 10);
    
    // Save PDF
    doc.save(`Reporte_${selectedContributor.ruc}_${selectedContributor.companyName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#003876]">Base de Contribuyentes</h1>
          <p className="text-gray-600">Gestión y monitoreo de contribuyentes fiscalizados</p>
        </div>
        <Button className="bg-[#003876] hover:bg-[#002555]">
          <Download className="w-4 h-4 mr-2" />
          Exportar Base
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Contribuyentes</p>
                <p className="text-[#003876]">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-[#003876]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Activos</p>
                <p className="text-green-600">{stats.activos}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Alto Riesgo</p>
                <p className="text-red-600">{stats.altoRiesgo}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Con Casos Abiertos</p>
                <p className="text-yellow-600">{stats.conCasosAbiertos}</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-600" />
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
                placeholder="Buscar por razón social, RUC o nombre comercial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-48">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Nivel de riesgo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="bajo">Bajo</SelectItem>
                <SelectItem value="medio">Medio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="crítico">Crítico</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los sectores</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contributors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contribuyentes Registrados ({filteredContributors.length})</CardTitle>
          <CardDescription>Lista de contribuyentes bajo supervisión tributaria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600">RUC</th>
                  <th className="text-left py-3 px-4 text-gray-600">Empresa</th>
                  <th className="text-left py-3 px-4 text-gray-600">Sector</th>
                  <th className="text-left py-3 px-4 text-gray-600">Tamaño</th>
                  <th className="text-left py-3 px-4 text-gray-600">Riesgo</th>
                  <th className="text-left py-3 px-4 text-gray-600">Cumplimiento</th>
                  <th className="text-left py-3 px-4 text-gray-600">Casos</th>
                  <th className="text-left py-3 px-4 text-gray-600">Estado</th>
                  <th className="text-left py-3 px-4 text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredContributors.map((contributor) => {
                  const RiskIcon = riskConfig[contributor.riskLevel].icon;
                  return (
                    <tr key={contributor.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{contributor.ruc}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-[#003876]">{contributor.companyName}</p>
                          <p className="text-xs text-gray-500">{contributor.tradeName}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{contributor.sector}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{sizeLabels[contributor.size]}</td>
                      <td className="py-3 px-4">
                        <Badge className={riskConfig[contributor.riskLevel].color}>
                          <RiskIcon className="w-3 h-3 mr-1" />
                          {riskConfig[contributor.riskLevel].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Progress value={contributor.complianceRate} className="w-16 h-2" />
                          <span className="text-sm">{contributor.complianceRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={contributor.openCases > 0 ? "destructive" : "secondary"}>
                          {contributor.openCases} abiertos
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={contributor.status === 'activo' ? 'default' : 'destructive'}>
                          {contributor.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(contributor)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Contributor Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedContributor && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-[#003876] text-white">
                        {selectedContributor.companyName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{selectedContributor.companyName}</span>
                      <p className="text-sm text-gray-500 font-normal">{selectedContributor.tradeName}</p>
                    </div>
                  </div>
                  <Badge className={riskConfig[selectedContributor.riskLevel].color}>
                    Score: {selectedContributor.riskScore}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  RUC: {selectedContributor.ruc} - {selectedContributor.sector}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="financial">Financiero</TabsTrigger>
                  <TabsTrigger value="compliance">Cumplimiento</TabsTrigger>
                  <TabsTrigger value="risk">Análisis Riesgo</TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Información Legal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">RUC</p>
                          <p className="font-mono">{selectedContributor.ruc}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Representante Legal</p>
                          <p>{selectedContributor.legalRep}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha de Registro</p>
                          <p>{new Date(selectedContributor.registrationDate).toLocaleDateString('es-PE')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estado</p>
                          <Badge variant={selectedContributor.status === 'activo' ? 'default' : 'destructive'}>
                            {selectedContributor.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Información de Contacto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm">{selectedContributor.address}</p>
                            <p className="text-sm text-gray-600">{selectedContributor.district}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="text-sm">{selectedContributor.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <p className="text-sm">{selectedContributor.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <Badge variant="outline" className="mr-2">{selectedContributor.sector}</Badge>
                            <Badge variant="outline">{sizeLabels[selectedContributor.size]}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Ingreso Promedio Mensual</p>
                          <p className="text-[#003876]">S/. {selectedContributor.monthlyAvgRevenue.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Total Impuestos Pagados</p>
                          <p className="text-green-600">S/. {selectedContributor.totalTaxes.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Última Declaración</p>
                          <p className="text-sm">{new Date(selectedContributor.lastDeclaration).toLocaleDateString('es-PE')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Evolución de Ingresos y Tributos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={selectedContributor.declarations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => `S/. ${value.toLocaleString()}`} />
                          <Line type="monotone" dataKey="revenue" stroke="#003876" strokeWidth={2} name="Ingresos" />
                          <Line type="monotone" dataKey="taxes" stroke="#4A90E2" strokeWidth={2} name="Impuestos" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tasa de Cumplimiento</CardTitle>
                        <CardDescription>Nivel general de cumplimiento tributario</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Cumplimiento General</span>
                              <span className="text-sm font-semibold">{selectedContributor.complianceRate}%</span>
                            </div>
                            <Progress value={selectedContributor.complianceRate} className="h-2" />
                          </div>
                          <div className="pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Declaraciones a tiempo:</span>
                              <span className="font-semibold">92%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Pagos puntuales:</span>
                              <span className="font-semibold">{selectedContributor.complianceRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Documentación completa:</span>
                              <span className="font-semibold">88%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Historial de Pagos</CardTitle>
                        <CardDescription>Últimos 6 meses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={selectedContributor.paymentHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `S/. ${value.toLocaleString()}`} />
                            <Bar dataKey="amount" fill="#003876" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evaluación de Riesgo</CardTitle>
                      <CardDescription>Análisis de factores de riesgo tributario</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              selectedContributor.riskScore >= 70 ? 'bg-red-100' :
                              selectedContributor.riskScore >= 50 ? 'bg-yellow-100' : 'bg-green-100'
                            }`}>
                              <span className={`text-2xl ${
                                selectedContributor.riskScore >= 70 ? 'text-red-600' :
                                selectedContributor.riskScore >= 50 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {selectedContributor.riskScore}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Score de Riesgo</p>
                              <p className="text-[#003876]">Nivel {riskConfig[selectedContributor.riskLevel].label}</p>
                            </div>
                          </div>
                          <Badge className={riskConfig[selectedContributor.riskLevel].color}>
                            {riskConfig[selectedContributor.riskLevel].label}
                          </Badge>
                        </div>

                        {selectedContributor.flags.length > 0 && (
                          <div>
                            <p className="text-sm mb-3">Señales de Alerta Detectadas:</p>
                            <div className="space-y-2">
                              {selectedContributor.flags.map((flag, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span className="text-sm text-red-800">{flag}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de Casos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Casos Históricos</p>
                          <p className="text-[#003876]">{selectedContributor.historicalCases}</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">Casos Abiertos</p>
                          <p className="text-yellow-600">{selectedContributor.openCases}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Casos Cerrados</p>
                          <p className="text-green-600">{selectedContributor.historicalCases - selectedContributor.openCases}</p>
                        </div>
                      </div>
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">Historial detallado de casos en desarrollo</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Cerrar
                </Button>
                <Button 
                  className="bg-[#003876] hover:bg-[#002555]"
                  onClick={handleGenerateReport}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
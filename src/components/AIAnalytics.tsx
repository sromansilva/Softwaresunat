import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, TrendingUp, AlertCircle, CheckCircle2, Eye } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const aiInsights = [
  {
    title: 'Patrón de Evasión Detectado o ño',
    description: 'Se identificó un patrón común en 23 empresas del sector construcción que subvaloran facturas de importación.',
    severity: 'high',
    confidence: 94,
    icon: AlertCircle,
  },
  {
    title: 'Anomalía en Declaraciones aña',
    description: '15 contribuyentes muestran inconsistencias significativas entre sus ventas declaradas y movimientos bancarios.',
    severity: 'high',
    confidence: 89,
    icon: AlertCircle,
  },
  {
    title: 'Tendencia Positiva oñoo',
    description: 'El cumplimiento tributario en el sector retail ha aumentado un 12% en el último trimestre.',
    severity: 'low',
    confidence: 91,
    icon: CheckCircle2,
  },
  {
    title: 'Red de Empresas Vinculadas',
    description: 'Se detectó una red de 8 empresas con directores comunes que realizan triangulación de facturas.',
    severity: 'high',
    confidence: 87,
    icon: Eye,
  },
];

const suspiciousCompanies = [
  { nombre: 'Importadora del Pacífico SA', ruc: '20147258369', score: 92, razones: ['Facturas duplicadas', 'Movimientos irregulares', 'Subdeclaración'] },
  { nombre: 'Constructora Megaproyectos EIRL', ruc: '20369147258', score: 88, razones: ['Sobrevaloración de gastos', 'Personal fantasma'] },
  { nombre: 'Comercializadora Global SAC', ruc: '20258147369', score: 85, razones: ['Triangulación', 'Facturación fantasma'] },
  { nombre: 'Servicios Integrados del Sur SA', ruc: '20987321654', score: 83, razones: ['Inconsistencias bancarias', 'RUC de baja'] },
  { nombre: 'Distribuidora Prime EIRL', ruc: '20654789321', score: 81, razones: ['Exportaciones ficticias', 'Documentación irregular'] },
];

const anomalyData = [
  { tipo: 'Facturas Duplicadas', casos: 45 },
  { tipo: 'Subdeclaración', casos: 67 },
  { tipo: 'Documentos Falsos', casos: 23 },
  { tipo: 'Inconsistencia Bancaria', casos: 89 },
  { tipo: 'Triangulación', casos: 34 },
];

const riskDistribution = [
  { name: 'Muy Alto', value: 34, color: '#dc2626' },
  { name: 'Alto', value: 67, color: '#f59e0b' },
  { name: 'Medio', value: 123, color: '#3b82f6' },
  { name: 'Bajo', value: 198, color: '#10b981' },
];

const sectorAnalysis = [
  { sector: 'Construcción', riesgo: 8.4, casos: 45 },
  { sector: 'Comercio', riesgo: 7.8, casos: 89 },
  { sector: 'Minería', riesgo: 7.2, casos: 34 },
  { sector: 'Servicios', riesgo: 6.5, casos: 67 },
  { sector: 'Agricultura', riesgo: 5.9, casos: 28 },
];

export default function AIAnalytics() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-gray-900">IA Analítica</h2>
          <p className="text-sm text-gray-600">Sistema de Inteligencia Artificial para Detección de Riesgos Fiscales</p>
        </div>
      </div>

      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className="border-l-4" style={{ borderLeftColor: insight.severity === 'high' ? '#dc2626' : '#10b981' }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${insight.severity === 'high' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                      <Icon className={`w-5 h-5 ${insight.severity === 'high' ? 'text-red-600' : 'text-green-600'
                        }`} />
                    </div>
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {insight.confidence}% confianza
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Types */}
        <Card>
          <CardHeader>
            <CardTitle>Anomalías Detectadas por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={anomalyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="tipo" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="casos" fill="#003876" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Niveles de Riesgo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sector Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Riesgo por Sector</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sector" />
              <YAxis yAxisId="left" orientation="left" stroke="#003876" />
              <YAxis yAxisId="right" orientation="right" stroke="#dc2626" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="casos" fill="#003876" name="Casos Detectados" />
              <Bar yAxisId="right" dataKey="riesgo" fill="#dc2626" name="Nivel de Riesgo" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Suspicious Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Sospechosas - Prioridad Alta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suspiciousCompanies.map((company, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-gray-900">{company.nombre}</h4>
                      <Badge variant="destructive">
                        Score: {company.score}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">RUC: {company.ruc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600"
                        style={{ width: `${company.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.razones.map((razon, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {razon}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Model Info */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-gray-900 mb-2">Modelo de IA Activo</h4>
              <p className="text-sm text-gray-600 mb-3">
                El sistema utiliza algoritmos de machine learning para analizar patrones de comportamiento tributario,
                detectar anomalías y predecir riesgos de evasión fiscal con alta precisión.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Precisión del Modelo</div>
                  <div className="text-blue-600">94.2%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Casos Analizados</div>
                  <div className="text-blue-600">12,847</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Última Actualización</div>
                  <div className="text-blue-600">Hace 2 horas</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

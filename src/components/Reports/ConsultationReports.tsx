import React, { useState, useMemo } from 'react';
import { mockConsultations, mockAppointments } from '../../data/consultationMockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  FileText,
  Clock,
  CheckCircle,
  DollarSign,
  Activity,
  BarChart3,
  PieChart
} from 'lucide-react';

interface ConsultationReportsProps {
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const ConsultationReports: React.FC<ConsultationReportsProps> = ({ onShowToast }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportType, setReportType] = useState<'overview' | 'appointments' | 'revenue' | 'performance'>('overview');

  const consultationStats = useMemo(() => {
    const filteredConsultations = mockConsultations.filter(consultation => {
      const consultationDate = new Date(consultation.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return consultationDate >= startDate && consultationDate <= endDate;
    });

    const filteredAppointments = mockAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });

    const totalConsultations = filteredConsultations.length;
    const totalAppointments = filteredAppointments.length;
    const completedConsultations = filteredConsultations.filter(c => c.status === 'Completed').length;
    const totalRevenue = filteredConsultations
      .filter(c => c.paymentStatus === 'Paid')
      .reduce((sum, c) => sum + c.totalCost, 0);

    // Group by status
    const statusBreakdown = filteredConsultations.reduce((acc, consultation) => {
      acc[consultation.status] = (acc[consultation.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by appointment type
    const appointmentTypeBreakdown = filteredAppointments.reduce((acc, appointment) => {
      acc[appointment.type] = (acc[appointment.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group by species
    const speciesBreakdown = filteredConsultations.reduce((acc, consultation) => {
      const species = consultation.animal.species;
      acc[species] = (acc[species] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average consultation cost
    const averageConsultationCost = totalRevenue / completedConsultations || 0;

    // Monthly trends (mock data for demonstration)
    const monthlyTrends = [
      { month: 'Jan', consultations: 45, revenue: 3200, appointments: 52 },
      { month: 'Feb', consultations: 52, revenue: 3800, appointments: 58 },
      { month: 'Mar', consultations: 48, revenue: 3500, appointments: 55 },
      { month: 'Apr', consultations: 61, revenue: 4200, appointments: 68 },
      { month: 'May', consultations: 58, revenue: 4100, appointments: 65 },
      { month: 'Jun', consultations: 65, revenue: 4600, appointments: 72 }
    ];

    return {
      totalConsultations,
      totalAppointments,
      completedConsultations,
      totalRevenue,
      averageConsultationCost,
      statusBreakdown,
      appointmentTypeBreakdown,
      speciesBreakdown,
      monthlyTrends,
      filteredConsultations,
      filteredAppointments
    };
  }, [dateRange]);

  const handleExportReport = (type: string) => {
    onShowToast('success', `${type} report exported successfully`);
  };

  const handleGenerateReport = () => {
    onShowToast('success', 'Consultation report generated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="overview">Overview Report</option>
              <option value="appointments">Appointment Analysis</option>
              <option value="revenue">Revenue Analysis</option>
              <option value="performance">Performance Metrics</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleGenerateReport} icon={FileText} variant="secondary">
              Generate Report
            </Button>
            <Button onClick={() => handleExportReport('Consultation')} icon={Download}>
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Stethoscope className="h-8 w-8 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Total Consultations</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">{consultationStats.totalConsultations}</p>
                <p className="ml-2 text-sm font-medium text-emerald-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +15.3%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-100" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Appointments</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">{consultationStats.totalAppointments}</p>
                <p className="ml-2 text-sm font-medium text-blue-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +12.8%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-100" />
            </div>
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">${consultationStats.totalRevenue.toFixed(0)}</p>
                <p className="ml-2 text-sm font-medium text-green-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +18.5%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">Completion Rate</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold">
                  {((consultationStats.completedConsultations / consultationStats.totalConsultations) * 100 || 0).toFixed(0)}%
                </p>
                <p className="ml-2 text-sm font-medium text-purple-200">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  +5.2%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Status Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(consultationStats.statusBreakdown).map(([status, count], index) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                    status === 'Completed' ? 'from-green-500 to-green-600' :
                    status === 'Scheduled' ? 'from-blue-500 to-blue-600' :
                    status === 'In Progress' ? 'from-yellow-500 to-yellow-600' :
                    'from-gray-500 to-gray-600'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{status}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">
                    {((count / consultationStats.totalConsultations) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Types</h3>
          <div className="space-y-4">
            {Object.entries(consultationStats.appointmentTypeBreakdown).map(([type, count], index) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                    index === 0 ? 'from-emerald-500 to-emerald-600' :
                    index === 1 ? 'from-blue-500 to-blue-600' :
                    index === 2 ? 'from-purple-500 to-purple-600' :
                    index === 3 ? 'from-orange-500 to-orange-600' :
                    'from-gray-500 to-gray-600'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{type}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">
                    {((count / consultationStats.totalAppointments) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Monthly consultation trends</p>
            <p className="text-sm text-gray-500 mt-2">Consultations, appointments, and revenue over time</p>
          </div>
        </div>
      </Card>

      {/* Species Breakdown */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultations by Species</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {Object.entries(consultationStats.speciesBreakdown).map(([species, count], index) => (
              <div key={species} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                    species === 'Dog' ? 'from-blue-500 to-blue-600' :
                    species === 'Cat' ? 'from-purple-500 to-purple-600' :
                    'from-gray-500 to-gray-600'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">{species}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">
                    {((count / consultationStats.totalConsultations) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Species distribution chart</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Consultations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Consultations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultation #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultationStats.filteredConsultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {consultation.consultationNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(consultation.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{consultation.animal.name}</p>
                      <p className="text-xs text-gray-500">{consultation.animal.species}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {consultation.owner.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {consultation.diagnosis}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      consultation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      consultation.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      consultation.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {consultation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${consultation.totalCost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Performance Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${consultationStats.averageConsultationCost.toFixed(0)}</p>
            <p className="text-sm text-gray-600">Average Consultation Cost</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">45</p>
            <p className="text-sm text-gray-600">Avg Duration (minutes)</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-sm text-gray-600">Patient Satisfaction</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConsultationReports;
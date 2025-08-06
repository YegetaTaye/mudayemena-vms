import React, { useState, useMemo } from 'react';
import { Consultation, Appointment } from '../../types/consultation';
import { mockConsultations, mockAppointments } from '../../data/consultationMockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Stethoscope, 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Activity
} from 'lucide-react';

interface ConsultationDashboardProps {
  onCreateConsultation: () => void;
  onEditConsultation: (consultation: Consultation) => void;
  onViewConsultation: (consultation: Consultation) => void;
  onCreateAppointment: () => void;
}

const ConsultationDashboard: React.FC<ConsultationDashboardProps> = ({
  onCreateConsultation,
  onEditConsultation,
  onViewConsultation,
  onCreateAppointment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Consultation['status']>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'animal' | 'owner' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Consultation['status']) => {
    switch (status) {
      case 'Scheduled':
        return <Clock className="h-4 w-4" />;
      case 'In Progress':
        return <Activity className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: Consultation['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredAndSortedConsultations = useMemo(() => {
    let filtered = mockConsultations.filter(consultation => {
      const matchesSearch = consultation.animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultation.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultation.consultationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (statusFilter !== 'all' && consultation.status !== statusFilter) return false;
      
      if (dateFilter !== 'all') {
        const consultationDate = new Date(consultation.date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - consultationDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'today':
            if (daysDiff !== 0) return false;
            break;
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
        }
      }
      
      return true;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(`${a.date} ${a.time}`).getTime();
          bValue = new Date(`${b.date} ${b.time}`).getTime();
          break;
        case 'animal':
          aValue = a.animal.name.toLowerCase();
          bValue = b.animal.name.toLowerCase();
          break;
        case 'owner':
          aValue = a.owner.name.toLowerCase();
          bValue = b.owner.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  const stats = useMemo(() => {
    const total = mockConsultations.length;
    const scheduled = mockConsultations.filter(c => c.status === 'Scheduled').length;
    const completed = mockConsultations.filter(c => c.status === 'Completed').length;
    const inProgress = mockConsultations.filter(c => c.status === 'In Progress').length;
    const totalRevenue = mockConsultations
      .filter(c => c.paymentStatus === 'Paid')
      .reduce((sum, c) => sum + c.totalCost, 0);
    const todayAppointments = mockAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

    return { total, scheduled, completed, inProgress, totalRevenue, todayAppointments };
  }, []);

  const upcomingAppointments = mockAppointments
    .filter(apt => new Date(`${apt.date} ${apt.time}`) > new Date())
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Stethoscope className="h-8 w-8 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Total Consultations</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-100" />
            </div>
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Scheduled</p>
              <p className="text-2xl font-bold">{stats.scheduled}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-yellow-100" />
            </div>
            <div className="ml-4">
              <p className="text-yellow-100 text-sm font-medium">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-100" />
            </div>
            <div className="ml-4">
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-100" />
            </div>
            <div className="ml-4">
              <p className="text-purple-100 text-sm font-medium">Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-orange-100" />
            </div>
            <div className="ml-4">
              <p className="text-orange-100 text-sm font-medium">Today's Appointments</p>
              <p className="text-2xl font-bold">{stats.todayAppointments}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button 
              onClick={onCreateConsultation} 
              icon={Plus} 
              className="w-full justify-start"
              variant="secondary"
            >
              New Consultation
            </Button>
            <Button 
              onClick={onCreateAppointment} 
              icon={Calendar} 
              className="w-full justify-start"
              variant="secondary"
            >
              Schedule Appointment
            </Button>
            <Button 
              icon={FileText} 
              className="w-full justify-start"
              variant="secondary"
            >
              Generate Report
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{appointment.animal.name}</p>
                  <p className="text-xs text-gray-600">{appointment.owner.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">{appointment.type}</span>
                </div>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <p className="text-sm text-gray-500 italic">No upcoming appointments</p>
            )}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="date-desc">Latest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="animal-asc">Animal A-Z</option>
              <option value="animal-desc">Animal Z-A</option>
              <option value="owner-asc">Owner A-Z</option>
              <option value="owner-desc">Owner Z-A</option>
              <option value="status-asc">Status A-Z</option>
              <option value="status-desc">Status Z-A</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Consultations Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultation Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient & Owner
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedConsultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{consultation.consultationNumber}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(consultation.date).toLocaleDateString()} at {consultation.time}
                      </p>
                      <p className="text-xs text-gray-500">Dr. {consultation.veterinarian}</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{consultation.animal.name}</p>
                      <p className="text-sm text-gray-600">{consultation.animal.species} • {consultation.animal.breed}</p>
                      <p className="text-xs text-gray-500">{consultation.owner.name}</p>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{consultation.diagnosis}</p>
                    <p className="text-xs text-gray-500 mt-1">{consultation.chiefComplaint}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(consultation.status)}`}>
                        {getStatusIcon(consultation.status)}
                        <span>{consultation.status}</span>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(consultation.paymentStatus)}`}>
                        <span>{consultation.paymentStatus}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">${consultation.totalCost.toFixed(2)}</p>
                    {consultation.prescriptions.length > 0 && (
                      <p className="text-xs text-gray-500">{consultation.prescriptions.length} prescriptions</p>
                    )}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => onViewConsultation(consultation)}
                        icon={Eye}
                      >
                        View
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => onEditConsultation(consultation)}
                        icon={Edit}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedConsultations.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Consultations Found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first consultation to get started.'
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ConsultationDashboard;
import React, { useState } from 'react';
import { Consultation, Appointment } from '../../types/consultation';
import ConsultationDashboard from './ConsultationDashboard';
import ConsultationForm from './ConsultationForm';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentForm from './AppointmentForm';
import ConsultationView from './ConsultationView';
import Button from '../Common/Button';
import Toast from '../Common/Toast';
import { useUser } from '../../context/UserContext';
import { Plus, ArrowLeft, Calendar, FileText, Stethoscope } from 'lucide-react';

type View = 'dashboard' | 'calendar' | 'consultation-form' | 'appointment-form' | 'consultation-view';

const ConsultationModule: React.FC = () => {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isConsultationFormOpen, setIsConsultationFormOpen] = useState(false);
  const [isAppointmentFormOpen, setIsAppointmentFormOpen] = useState(false);
  const [isConsultationViewOpen, setIsConsultationViewOpen] = useState(false);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });

  const showToast = (type: typeof toast.type, message: string) => {
    setToast({ type, message, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleCreateConsultation = () => {
    setSelectedConsultation(null);
    setIsConsultationFormOpen(true);
  };

  const handleEditConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsConsultationFormOpen(true);
  };

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsConsultationViewOpen(true);
  };

  const handleCreateAppointment = (appointment?: Partial<Appointment>) => {
    if (appointment) {
      setSelectedAppointment(appointment as Appointment);
    } else {
      setSelectedAppointment(null);
    }
    setIsAppointmentFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsAppointmentFormOpen(true);
  };

  const handleSaveConsultation = (consultation: Partial<Consultation>) => {
    if (selectedConsultation) {
      showToast('success', 'Consultation updated successfully');
    } else {
      showToast('success', 'New consultation created successfully');
    }
    setSelectedConsultation(null);
  };

  const handleSaveAppointment = (appointment: Partial<Appointment>) => {
    if (selectedAppointment) {
      showToast('success', 'Appointment updated successfully');
    } else {
      showToast('success', 'New appointment scheduled successfully');
    }
    setSelectedAppointment(null);
  };

  const handleCloseConsultationForm = () => {
    setIsConsultationFormOpen(false);
    setSelectedConsultation(null);
  };

  const handleCloseAppointmentForm = () => {
    setIsAppointmentFormOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseConsultationView = () => {
    setIsConsultationViewOpen(false);
    setSelectedConsultation(null);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'calendar':
        return 'Appointment Calendar';
      case 'dashboard':
      default:
        return 'Consultations';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'calendar':
        return 'Schedule and manage veterinary appointments';
      case 'dashboard':
      default:
        return 'Manage veterinary consultations and patient records';
    }
  };

  if (!user) {
    return <div>Access denied. Please log in.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
            <p className="text-sm text-gray-600 mt-1">{getSubtitle()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant={currentView === 'dashboard' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('dashboard')} 
            icon={Stethoscope}
            size="sm"
          >
            Consultations
          </Button>
          <Button 
            variant={currentView === 'calendar' ? 'primary' : 'secondary'}
            onClick={() => setCurrentView('calendar')} 
            icon={Calendar}
            size="sm"
          >
            Calendar
          </Button>
          <Button onClick={handleCreateConsultation} icon={Plus}>
            New Consultation
          </Button>
        </div>
      </div>

      {/* Content */}
      {currentView === 'dashboard' && (
        <ConsultationDashboard
          onCreateConsultation={handleCreateConsultation}
          onEditConsultation={handleEditConsultation}
          onViewConsultation={handleViewConsultation}
          onCreateAppointment={handleCreateAppointment}
        />
      )}

      {currentView === 'calendar' && (
        <AppointmentCalendar
          onCreateAppointment={handleCreateAppointment}
          onEditAppointment={handleEditAppointment}
          onViewConsultation={handleViewConsultation}
        />
      )}

      {/* Consultation Form Modal */}
      <ConsultationForm
        consultation={selectedConsultation || undefined}
        isOpen={isConsultationFormOpen}
        onClose={handleCloseConsultationForm}
        onSave={handleSaveConsultation}
      />

      {/* Appointment Form Modal */}
      <AppointmentForm
        appointment={selectedAppointment || undefined}
        isOpen={isAppointmentFormOpen}
        onClose={handleCloseAppointmentForm}
        onSave={handleSaveAppointment}
      />

      {/* Consultation View Modal */}
      <ConsultationView
        consultation={selectedConsultation}
        isOpen={isConsultationViewOpen}
        onClose={handleCloseConsultationView}
        onEdit={() => {
          setIsConsultationViewOpen(false);
          setIsConsultationFormOpen(true);
        }}
      />

      {/* Toast Notifications */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default ConsultationModule;
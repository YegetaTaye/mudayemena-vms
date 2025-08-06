import React, { useState, useMemo } from 'react';
import { Appointment, Consultation } from '../../types/consultation';
import { mockAppointments, mockConsultations } from '../../data/consultationMockData';
import Card from '../Common/Card';
import Button from '../Common/Button';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react';

interface AppointmentCalendarProps {
  onCreateAppointment: (appointment?: Partial<Appointment>) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onViewConsultation: (consultation: Consultation) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  onCreateAppointment,
  onEditAppointment,
  onViewConsultation
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'No Show':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'Consultation':
        return 'bg-emerald-500';
      case 'Follow-up':
        return 'bg-blue-500';
      case 'Vaccination':
        return 'bg-purple-500';
      case 'Surgery':
        return 'bg-red-500';
      case 'Emergency':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 1);
      } else {
        newDate.setDate(prev.getDate() + 1);
      }
      return newDate;
    });
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'month':
        navigateMonth(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'day':
        navigateDay(direction);
        break;
    }
  };

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return mockAppointments.filter(apt => apt.date === dateString);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    if (viewMode === 'month') {
      setCurrentDate(date);
      setViewMode('day');
    }
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    onCreateAppointment({
      date: date.toISOString().split('T')[0],
      time: time,
      duration: 30
    });
  };

  const findRelatedConsultation = (appointment: Appointment): Consultation | null => {
    return mockConsultations.find(c => 
      c.animalId === appointment.animalId && 
      c.date === appointment.date && 
      c.time === appointment.time
    ) || null;
  };

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    
    switch (viewMode) {
      case 'month':
        return currentDate.toLocaleDateString('en-US', options);
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'day':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      default:
        return '';
    }
  };

  const renderMonthView = () => {
    const days = getMonthDays();
    const today = new Date();
    const currentMonth = currentDate.getMonth();

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const isToday = day.toDateString() === today.toDateString();
          const isCurrentMonth = day.getMonth() === currentMonth;
          const appointments = getAppointmentsForDate(day);
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
              } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {appointments.slice(0, 3).map(apt => (
                  <div
                    key={apt.id}
                    className={`text-xs p-1 rounded truncate ${getStatusColor(apt.status)}`}
                    title={`${apt.time} - ${apt.animal.name} (${apt.type})`}
                  >
                    <div className={`w-2 h-2 rounded-full inline-block mr-1 ${getTypeColor(apt.type)}`}></div>
                    {apt.time} {apt.animal.name}
                  </div>
                ))}
                {appointments.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{appointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getWeekDays();
    const timeSlots = getTimeSlots();

    return (
      <div className="flex">
        {/* Time column */}
        <div className="w-20 border-r border-gray-200">
          <div className="h-12 border-b border-gray-200"></div>
          {timeSlots.map(time => (
            <div key={time} className="h-16 border-b border-gray-200 p-2 text-xs text-gray-500">
              {time}
            </div>
          ))}
        </div>
        
        {/* Days columns */}
        {days.map(day => {
          const appointments = getAppointmentsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div key={day.toISOString()} className="flex-1 border-r border-gray-200">
              <div className={`h-12 border-b border-gray-200 p-2 text-center ${isToday ? 'bg-blue-50' : ''}`}>
                <div className="text-sm font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-lg ${isToday ? 'text-blue-600 font-bold' : ''}`}>{day.getDate()}</div>
              </div>
              
              <div className="relative">
                {timeSlots.map(time => (
                  <div
                    key={time}
                    onClick={() => handleTimeSlotClick(day, time)}
                    className="h-16 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {appointments
                      .filter(apt => apt.time === time)
                      .map(apt => (
                        <div
                          key={apt.id}
                          className={`absolute left-1 right-1 p-1 rounded text-xs ${getStatusColor(apt.status)} z-10`}
                          style={{ top: '2px' }}
                        >
                          <div className={`w-2 h-2 rounded-full inline-block mr-1 ${getTypeColor(apt.type)}`}></div>
                          {apt.animal.name} - {apt.type}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const appointments = getAppointmentsForDate(currentDate);
    const timeSlots = getTimeSlots();

    return (
      <div className="space-y-4">
        {/* Day appointments list */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Appointments for {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(appointment => {
                  const consultation = findRelatedConsultation(appointment);
                  
                  return (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${getTypeColor(appointment.type)}`}></div>
                            <span className="font-medium text-gray-900">{appointment.time}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">{appointment.animal.name}</p>
                              <p className="text-gray-600">{appointment.animal.species} • {appointment.animal.breed}</p>
                              <p className="text-gray-500">{appointment.owner.name}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Type: {appointment.type}</p>
                              <p className="text-gray-600">Duration: {appointment.duration} minutes</p>
                              <p className="text-gray-600">Reason: {appointment.reason}</p>
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                              <strong>Notes:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {consultation && (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => onViewConsultation(consultation)}
                              icon={Eye}
                            >
                              View Consultation
                            </Button>
                          )}
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => onEditAppointment(appointment)}
                            icon={Edit}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No appointments scheduled for this day</p>
              <Button 
                onClick={() => handleTimeSlotClick(currentDate, '09:00')} 
                icon={Plus} 
                size="sm"
                className="mt-4"
              >
                Schedule Appointment
              </Button>
            </div>
          )}
        </Card>

        {/* Time slots */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {timeSlots.map(time => {
              const hasAppointment = appointments.some(apt => apt.time === time);
              
              return (
                <button
                  key={time}
                  onClick={() => !hasAppointment && handleTimeSlotClick(currentDate, time)}
                  disabled={hasAppointment}
                  className={`p-2 text-sm rounded-lg border transition-colors ${
                    hasAppointment 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="secondary" onClick={() => handleNavigate('prev')} icon={ChevronLeft} size="sm">
              Previous
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">{formatDateHeader()}</h2>
            <Button variant="secondary" onClick={() => handleNavigate('next')} icon={ChevronRight} size="sm">
              Next
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm ${viewMode === 'month' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm border-l border-gray-300 ${viewMode === 'week' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm border-l border-gray-300 ${viewMode === 'day' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Day
              </button>
            </div>
            
            <Button onClick={() => onCreateAppointment()} icon={Plus}>
              New Appointment
            </Button>
          </div>
        </div>
      </Card>

      {/* Calendar Content */}
      <Card padding="none">
        <div className="p-6">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </div>
      </Card>

      {/* Legend */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Appointment Types</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          {[
            { type: 'Consultation', color: 'bg-emerald-500' },
            { type: 'Follow-up', color: 'bg-blue-500' },
            { type: 'Vaccination', color: 'bg-purple-500' },
            { type: 'Surgery', color: 'bg-red-500' },
            { type: 'Emergency', color: 'bg-orange-500' }
          ].map(({ type, color }) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${color}`}></div>
              <span className="text-gray-700">{type}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AppointmentCalendar;
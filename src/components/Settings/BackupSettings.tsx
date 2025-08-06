import React from 'react';
import { Download, Upload, Database, Clock } from 'lucide-react';
import Card from '../Common/Card';
import Button from '../Common/Button';

interface BackupSettingsProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ onShowToast }) => {
  const handleBackupData = () => {
    // Simulate backup process
    onShowToast('Data backup initiated successfully', 'success');
  };

  const handleRestoreData = () => {
    // Simulate restore process
    onShowToast('Data restore completed', 'success');
  };

  const handleExportData = () => {
    // Simulate export process
    onShowToast('Data exported successfully', 'success');
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Backup & Restore
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Create Backup</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Create a complete backup of your system data including inventory, consultations, and user data.
                </p>
                <Button
                  onClick={handleBackupData}
                  className="w-full flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Restore Data</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Restore your system from a previously created backup file.
                </p>
                <Button
                  onClick={handleRestoreData}
                  variant="secondary"
                  className="w-full flex items-center justify-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Restore Backup
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Data Export
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Export specific data sets for reporting or migration purposes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="flex items-center justify-center"
              >
                Export Inventory
              </Button>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="flex items-center justify-center"
              >
                Export Consultations
              </Button>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="flex items-center justify-center"
              >
                Export Users
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Automatic Backups
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Enable Automatic Backups</h4>
                <p className="text-sm text-gray-600">
                  Automatically create backups on a scheduled basis
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retention Period
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>1 year</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BackupSettings;
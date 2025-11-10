import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string;
  initialStartDate?: string;
  initialEndDate?: string;
  onSave: (startDate: string, endDate: string) => Promise<void>;
}

export default function DatePickerModal({
  isOpen,
  onClose,
  countryName,
  initialStartDate = '',
  initialEndDate = '',
  onSave
}: DatePickerModalProps) {
  const { currentTheme } = useTheme();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Update local state when initial values change
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate, isOpen]);

  const handleSave = async () => {
    await onSave(startDate, endDate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative theme-surface rounded-lg shadow-xl max-w-md w-full mx-4 theme-border border">
        <div className="flex items-center justify-between p-6 theme-border border-b">
          <h3 className="text-lg font-semibold theme-text-primary">
            Travel Dates for {countryName}
          </h3>
          <button
            onClick={onClose}
            className="theme-text-muted hover:theme-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium theme-text-primary mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 theme-surface theme-text-primary"
              style={{ colorScheme: currentTheme.id === 'gruvbox' || currentTheme.id === 'midnight' ? 'dark' : 'light' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium theme-text-primary mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 theme-surface theme-text-primary"
              style={{ colorScheme: currentTheme.id === 'gruvbox' || currentTheme.id === 'midnight' ? 'dark' : 'light' }}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 theme-border border rounded-md theme-text-secondary hover:theme-surface-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md text-white transition-colors"
              style={{ backgroundColor: currentTheme.colors.success }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


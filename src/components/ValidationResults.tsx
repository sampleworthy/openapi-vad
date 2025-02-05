import React from 'react';
import { AlertCircle, AlertTriangle, Info, HelpCircle, Download } from 'lucide-react';
import type { ValidationResults as ValidationResultsType } from '../types';

interface ValidationResultsProps {
  results: ValidationResultsType;
  onDownload: () => void;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({ results, onDownload }) => {
  const { errors, warnings, infos, hints } = results;
  const hasResults = errors.length > 0 || warnings.length > 0 || infos.length > 0 || hints.length > 0;

  if (!hasResults) {
    return null;
  }

  const ResultSection = ({ title, items, icon: Icon, color }: any) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <h3 className="text-lg font-semibold">{title} ({items.length})</h3>
        </div>
        <div className="space-y-2">
          {items.map((item: any, index: number) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <p className="font-medium">{item.message}</p>
              <p className="text-sm text-gray-600 mt-1">
                Line {item.line}, Column {item.column} - Rule: {item.code}
              </p>
              {item.path.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Path: {item.path.join('.')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Validation Results</h2>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <ResultSection
        title="Errors"
        items={errors}
        icon={AlertCircle}
        color="text-red-500"
      />
      <ResultSection
        title="Warnings"
        items={warnings}
        icon={AlertTriangle}
        color="text-yellow-500"
      />
      <ResultSection
        title="Info"
        items={infos}
        icon={Info}
        color="text-blue-500"
      />
      <ResultSection
        title="Hints"
        items={hints}
        icon={HelpCircle}
        color="text-gray-500"
      />
    </div>
  );
};
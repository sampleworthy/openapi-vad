import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { ValidationResults } from './components/ValidationResults';
import { validateOpenAPI } from './utils/validator';
import { mapSpectralResults } from './types';
import type { ValidationResults as ValidationResultsType } from './types';
import { FileCheck } from 'lucide-react';

function App() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<ValidationResultsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const content = await file.text();
      const validationResults = await validateOpenAPI(content);
      setResults(mapSpectralResults(validationResults));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate file');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (!results) return;

    const report = {
      fileName,
      timestamp: new Date().toISOString(),
      results
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openapi-validation-report-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results, fileName]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <FileCheck className="mx-auto h-16 w-16 text-blue-500" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            OpenAPI Validator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload your OpenAPI specification and get instant validation results
          </p>
        </div>

        <FileUpload onFileSelect={handleFileSelect} />

        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Validating your OpenAPI specification...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {results && <ValidationResults results={results} onDownload={handleDownload} />}
      </div>
    </div>
  );
}

export default App;
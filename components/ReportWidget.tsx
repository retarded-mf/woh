
import React, { useState, useCallback } from 'react';
import Card from './common/Card.tsx';
import Spinner from './common/Spinner.tsx';
import { generateFinancialReportStream } from '../services/geminiService.ts';

const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// This component is the user interface for the Generative AI Report Agent.
// Educational note: It demonstrates how to handle a streaming API response in React.
// The report content is built up incrementally in the state as new data chunks arrive,
// providing a real-time feel to the generation process.
const ReportWidget: React.FC = () => {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = useCallback(async () => {
    setIsLoading(true);
    setReport('');
    setError(null);
    try {
      const stream = generateFinancialReportStream('ORNG'); // Using a fictional ticker 'ORNG' for Orange Inc.
      let fullReport = '';
      for await (const chunk of stream) {
        fullReport += chunk;
        setReport(fullReport);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate the report. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatReport = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('###')) {
          return <h3 key={index} className="text-md font-semibold text-cyan-400 mt-4 mb-2">{line.replace('###', '').trim()}</h3>;
        }
        if (line.startsWith('-')) {
          return <li key={index} className="ml-4 list-disc">{line.substring(1).trim()}</li>;
        }
        return <p key={index} className="mb-2 text-gray-400">{line}</p>;
      });
  };

  return (
    <Card title="Generative AI Report Agent" icon={<ReportIcon />}>
      <div className="flex flex-col h-full">
        <p className="text-sm text-gray-400 mb-4">
          This agent uses the Gemini API to generate a detailed financial report on demand. Click the button to get an analysis for 'ORNG' stock.
        </p>
        <button
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
        >
          {isLoading ? 'Generating Report...' : 'Generate Financial Report'}
        </button>

        <div className="mt-4 border-t border-gray-700 pt-4 flex-grow overflow-y-auto" style={{maxHeight: '400px'}}>
          {isLoading && !report && <Spinner text="Initializing generation..." />}
          {error && <p className="text-red-400">{error}</p>}
          <div className="prose prose-invert prose-sm max-w-none">
            {formatReport(report)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReportWidget;
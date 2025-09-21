
import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import { getMockMentorTips } from '../services/marketDataService';
import type { MentorTip } from '../types';

const MentorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

// This component is the UI for the Personalized Mentor Agent.
// Educational note: This agent serves as a guide, connecting the dots between the other agents' outputs.
// Its purpose is to provide context and educational content, helping the user understand *why* the other
// agents are showing what they are showing. This is a key part of making the platform educational.
const MentorWidget: React.FC = () => {
  const [tips, setTips] = useState<MentorTip[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    setTips(getMockMentorTips());
  }, []);

  const handleNextTip = () => {
    setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
  };

  const currentTip = tips[currentTipIndex];

  return (
    <Card title="Personalized Mentor Agent" icon={<MentorIcon />}>
      {currentTip ? (
        <div className="flex flex-col justify-between h-full">
          <div>
            <span className="text-xs bg-gray-700 text-cyan-400 px-2 py-1 rounded-full">{currentTip.relatedAgent} Agent Tip</span>
            <h3 className="text-lg font-semibold text-gray-200 mt-2">{currentTip.title}</h3>
            <p className="text-gray-400 mt-1">{currentTip.content}</p>
          </div>
          <button
            onClick={handleNextTip}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-cyan-400 font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto self-start"
          >
            Next Tip
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Loading tips...</p>
      )}
    </Card>
  );
};

export default MentorWidget;

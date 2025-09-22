
import React from 'react';
import ReportWidget from './ReportWidget.tsx';
import NewsWidget from './NewsWidget.tsx';
import TradingChartWidget from './TradingChartWidget.tsx';
import MentorWidget from './MentorWidget.tsx';

// The Dashboard component is the main container for all agent UI modules.
// Educational note: A dashboard interface is common in complex applications
// as it provides a high-level overview of various data streams and system components
// in one place. This one uses a CSS grid for a responsive, organized layout.
const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      
      {/* Trading Chart Agent is the centerpiece */}
      <div className="lg:col-span-3 xl:col-span-3">
        <TradingChartWidget />
      </div>

      {/* Market News Agent */}
      <div className="lg:col-span-2 xl:col-span-1">
        <NewsWidget />
      </div>

      {/* Generative AI Report Agent */}
      <div className="lg:col-span-3 xl:col-span-2">
        <ReportWidget />
      </div>

      {/* Personalized Mentor Agent */}
      <div className="lg:col-span-3 xl:col-span-2">
        <MentorWidget />
      </div>
    </div>
  );
};

export default Dashboard;
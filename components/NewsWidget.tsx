
import React, { useState, useEffect } from 'react';
import Card from './common/Card.tsx';
import Spinner from './common/Spinner.tsx';
import { getMockRawNews } from '../services/marketDataService.ts';
import { analyzeNews } from '../services/geminiService.ts';
import type { NewsItem } from '../types.ts';

const NewsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m0 0h2" /></svg>;

const sentimentStyles = {
    Positive: 'bg-green-500/20 text-green-400 border-green-500/30',
    Negative: 'bg-red-500/20 text-red-400 border-red-500/30',
    Neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

// This component is the UI for the Market News Agent.
// Educational note: It shows a practical application of AI - transforming a stream of raw data (headlines)
// into a curated, value-added feed with summaries and sentiment analysis.
// This process helps a user quickly digest large amounts of information.
const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndAnalyzeNews = async () => {
      setIsLoading(true);
      const rawNews = getMockRawNews();
      const analyzedItems = await analyzeNews(rawNews);
      setNews(analyzedItems);
      setIsLoading(false);
    };

    fetchAndAnalyzeNews();
  }, []);

  return (
    <Card title="Market News Agent" icon={<NewsIcon />}>
      {isLoading ? (
        <Spinner text="Fetching and analyzing news..." />
      ) : (
        <div className="space-y-4 overflow-y-auto" style={{maxHeight: '500px'}}>
          {news.map((item, index) => (
            <div key={index} className="border-b border-gray-700 pb-3 last:border-b-0">
              <h4 className="font-semibold text-gray-200">{item.headline}</h4>
              <p className="text-sm text-gray-400 my-1">{item.summary}</p>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className={`px-2 py-0.5 rounded-full border text-xs ${sentimentStyles[item.sentiment]}`}>
                  {item.sentiment}
                </span>
                <span className="text-gray-500">{item.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default NewsWidget;
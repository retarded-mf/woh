
import type { StockDataPoint, TradeSignal, NewsItem, MentorTip, RLAgentPerformance } from '../types';

// This service simulates a backend API for market data and agent results.
// Educational note: In a real application, this would make network requests to a Python backend.
// Using a mock service like this is crucial for frontend development, allowing UI work
// to proceed without a live backend.

/**
 * Generates mock historical stock data with a simulated forecast.
 * @returns An array of stock data points.
 */
export const getMockStockData = (): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  let price = 150;
  for (let i = 60; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price += (Math.random() - 0.5) * 5;
    price = Math.max(price, 100); // Keep price above a floor
    data.push({ date: date.toISOString().split('T')[0], price: parseFloat(price.toFixed(2)) });
  }

  // Simulate DL Agent's forecast
  let lastPrice = data[data.length - 1].price;
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    lastPrice += (Math.random() - 0.45) * 3; // Slight upward trend for forecast
    data.push({
      date: date.toISOString().split('T')[0],
      price: NaN, // No actual price for future dates
      forecast: parseFloat(lastPrice.toFixed(2)),
    });
  }
  return data;
};

/**
 * Generates mock trading signals from the ML Agent.
 * @returns An array of trade signals.
 */
export const getMockTradeSignals = (): TradeSignal[] => {
  return [
    { date: getDateString(-45), type: 'buy', price: 145.12, reason: 'Random Forest model detected a bullish divergence in RSI and MACD indicators, suggesting upward momentum.' },
    { date: getDateString(-28), type: 'sell', price: 162.78, reason: 'Price crossed below the 50-day moving average with high volume, a bearish signal confirmed by the model.' },
    { date: getDateString(-10), type: 'buy', price: 155.45, reason: 'Model identified a consolidation breakout pattern, predicting a potential rally.' },
  ];
};

/**
 * Generates mock performance data for the RL Agent.
 * @returns RL agent performance object.
 */
export const getMockRLPerformance = (): RLAgentPerformance => {
    return {
        profitOrLoss: 1245.67,
        trades: 42,
        winRate: 64.2,
    };
};


/**
 * Provides a list of mock news headlines to be analyzed by the news agent.
 * @returns An array of raw news headlines.
 */
export const getMockRawNews = (): {headline: string, source: string}[] => {
  return [
    { headline: "Tech Giant 'Orange' Unveils New AI Chip, Stock Jumps 5%", source: "MarketWatch" },
    { headline: "Federal Reserve Hints at Pausing Interest Rate Hikes", source: "Reuters" },
    { headline: "Supply Chain Issues Continue to Plague Auto Manufacturers", source: "Bloomberg" },
    { headline: "Orange's Competitor 'Pear' Reports Disappointing Earnings", source: "WSJ" },
    { headline: "Consumer Confidence Index Sees Unexpected Drop This Month", source: "Associated Press" },
  ];
};


/**
 * Provides a list of mock tips from the Personalized Mentor Agent.
 */
export const getMockMentorTips = (): MentorTip[] => {
    return [
        { id: 1, title: "Understanding Reports", content: "The AI-generated report provides a great starting point. Pay close attention to the 'Key Risks' section to build a balanced view.", relatedAgent: 'Report' },
        { id: 2, title: "Market Sentiment", content: "The news feed shows market sentiment. A string of 'Negative' articles might indicate a broader market downturn, even for a strong stock.", relatedAgent: 'News' },
        { id: 3, title: "Signal Confirmation", content: "The ML agent's signals are based on historical patterns. Use them as a guide, but look for confirmation from other sources, like news or your own analysis.", relatedAgent: 'Trading' },
        { id: 4, title: "Long-Term vs. Short-Term", content: "The DL agent's forecast is a short-term trend prediction. Contrast this with the fundamental analysis in the AI report for a long-term perspective.", relatedAgent: 'Trading' },
    ];
};


// Helper to get a date string for `n` days ago.
function getDateString(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysAgo);
    return date.toISOString().split('T')[0];
}


import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot } from 'recharts';
import Card from './common/Card';
import { getMockStockData, getMockTradeSignals, getMockRLPerformance } from '../services/marketDataService';
import type { StockDataPoint, TradeSignal, RLAgentPerformance } from '../types';

const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const MLAgentIcon = () => <span className="text-blue-400">ML</span>;
const DLAgentIcon = () => <span className="text-purple-400">DL</span>;
const RLAgentIcon = () => <span className="text-yellow-400">RL</span>;

// This is the most complex widget, serving as the UI for the Strategic Trader Agent and its sub-agents.
// Educational note: This component integrates and visualizes the outputs of multiple different ML models.
// - The line chart shows historical data (the environment).
// - ReferenceDots show discrete events from the ML classification model (buy/sell signals).
// - A dashed line shows a time-series forecast from the DL model.
// - A separate panel shows performance metrics from the RL agent.
// This demonstrates how different AI techniques can be combined to provide a comprehensive view.
const TradingChartWidget: React.FC = () => {
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [rlPerformance, setRlPerformance] = useState<RLAgentPerformance | null>(null);
  const [activeSignal, setActiveSignal] = useState<TradeSignal | null>(null);

  useEffect(() => {
    setData(getMockStockData());
    setSignals(getMockTradeSignals());
    setRlPerformance(getMockRLPerformance());
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-700 p-2 border border-gray-600 rounded">
          <p className="label text-sm">{`Date : ${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">{`${pld.name} : ${pld.value?.toFixed(2)}`}</p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card title="Strategic Trader Agent Dashboard" icon={<ChartIcon />}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
            <div className="md:col-span-3 h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                        <XAxis dataKey="date" stroke="#a0a0a0" tick={{ fontSize: 12 }} />
                        <YAxis stroke="#a0a0a0" tick={{ fontSize: 12 }} domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="price" stroke="#22d3ee" strokeWidth={2} dot={false} name="Actual Price" />
                        <Line type="monotone" dataKey="forecast" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" dot={false} name="DL Forecast" />
                        {signals.map((signal, index) => (
                            <ReferenceDot 
                                key={index} 
                                x={signal.date} 
                                y={signal.price} 
                                r={6} 
                                fill={signal.type === 'buy' ? '#22c55e' : '#ef4444'} 
                                stroke="#121212"
                                strokeWidth={2}
                                onMouseOver={() => setActiveSignal(signal)}
                                onMouseOut={() => setActiveSignal(null)}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="md:col-span-1 flex flex-col space-y-4">
                 <div className="bg-gray-700/50 p-3 rounded-lg flex-grow">
                    <h3 className="font-bold text-md mb-2 flex items-center"><MLAgentIcon /> <span className="ml-2">ML Agent: Signal Analysis</span></h3>
                    {activeSignal ? (
                        <div>
                             <p className={`font-bold text-lg ${activeSignal.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                {activeSignal.type.toUpperCase()} SIGNAL
                            </p>
                            <p className="text-sm text-gray-400">Date: {activeSignal.date}</p>
                            <p className="text-sm text-gray-400">Price: ${activeSignal.price}</p>
                            <p className="text-xs text-gray-300 mt-2 italic">Educational Reason: "{activeSignal.reason}"</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">Hover over a Buy (green) or Sell (red) signal on the chart to see the ML agent's reasoning.</p>
                    )}
                </div>
                 <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h3 className="font-bold text-md mb-2 flex items-center"><DLAgentIcon /><span className="ml-2">DL Agent: Price Forecast</span></h3>
                    <p className="text-sm text-gray-400">The dashed purple line represents the LSTM model's price forecast for the next 10 days, indicating the predicted trend.</p>
                </div>
                 <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h3 className="font-bold text-md mb-2 flex items-center"><RLAgentIcon /><span className="ml-2">RL Agent: Performance</span></h3>
                    {rlPerformance && <div className="text-sm space-y-1">
                        <p>Simulated P/L: <span className={`font-bold ${rlPerformance.profitOrLoss > 0 ? 'text-green-400' : 'text-red-400'}`}>${rlPerformance.profitOrLoss.toFixed(2)}</span></p>
                        <p>Total Trades: <span className="font-bold text-cyan-400">{rlPerformance.trades}</span></p>
                        <p>Win Rate: <span className="font-bold text-cyan-400">{rlPerformance.winRate}%</span></p>
                    </div>}
                </div>
            </div>
        </div>
    </Card>
  );
};

export default TradingChartWidget;

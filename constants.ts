import { Strategy, RiskProfile, MarketType, StrategyDetail, TradingPair, MarketCondition, NewsEvent } from './types';

export const STRATEGY_DETAILS: Record<Strategy, StrategyDetail> = {
  quantumfusion: { name: "⚡ QUANTUM FUSION", description: "Multi-indicator confirmation strategy using RSI, MACD, and Bollinger Bands." },
  neuralmatrix: { name: "🧠 NEURAL MATRIX", description: "Momentum-based strategy focusing on Stochastic and MACD crossovers." },
  vortex: { name: "🌀 VORTEX PREDICTOR", description: "Trend-following system that prioritizes market direction over reversal patterns." },
  atomic: { name: "⚛️ ATOMIC SIGNALS", description: "High-precision reversal strategy based on extreme RSI and Stochastic levels." },
  sureshot: { name: "🎯 SURE SHOT ELITE", description: "High-conviction signals requiring confluence of market structure, patterns, and indicators." }
};

export const STRATEGY_WIN_RATES: Record<Strategy, Record<RiskProfile, number>> = {
  quantumfusion: { conservative: 0.78, balanced: 0.82, aggressive: 0.85 },
  neuralmatrix: { conservative: 0.76, balanced: 0.80, aggressive: 0.84 },
  vortex: { conservative: 0.75, balanced: 0.79, aggressive: 0.82 },
  atomic: { conservative: 0.77, balanced: 0.81, aggressive: 0.86 },
  sureshot: { conservative: 0.80, balanced: 0.85, aggressive: 0.90 }
};

export const PAIRS_BY_MARKET_TYPE: Record<MarketType, TradingPair[]> = {
    forex: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'EURGBP', 'EURJPY', 'GBPJPY', 'USDMXN', 'USDCHF', 'NZDUSD', 'EURAUD', 'EURNZD', 'EURCAD', 'GBPCHF'],
    crypto: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT'],
    commodities: ['XAUUSD', 'XAGUSD', 'USOIL', 'UKOIL'],
    indices: ['US30', 'NAS100', 'SPX500', 'DE30', 'UK100']
};

export const MARKET_CONDITIONS: MarketCondition[] = [
    { name: "Strong Trend", description: "Strong trending market detected", factor: 1.05 },
    { name: "Ranging", description: "Ranging market conditions", factor: 1.0 },
    { name: "High Volatility", description: "High volatility detected", factor: 0.95 },
    { name: "Reversal Pattern", description: "Potential reversal pattern identified", factor: 1.02 }
];

// --- New Knowledge Base for V7.1 Engine ---

export const CANDLESTICK_PATTERNS: Record<string, { name: string; type: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; score: number }> = {
    'None': { name: 'None', type: 'NEUTRAL', score: 0 },
    'Doji': { name: 'Doji', type: 'NEUTRAL', score: 5 },
    'Hammer': { name: 'Hammer', type: 'BULLISH', score: 30 },
    'Inverted Hammer': { name: 'Inverted Hammer', type: 'BULLISH', score: 25 },
    'Shooting Star': { name: 'Shooting Star', type: 'BEARISH', score: 30 },
    'Hanging Man': { name: 'Hanging Man', type: 'BEARISH', score: 25 },
    'Bullish Engulfing': { name: 'Bullish Engulfing', type: 'BULLISH', score: 40 },
    'Bearish Engulfing': { name: 'Bearish Engulfing', type: 'BEARISH', score: 40 },
    'Morning Star': { name: 'Morning Star', type: 'BULLISH', score: 35 },
    'Evening Star': { name: 'Evening Star', type: 'BEARISH', score: 35 },
    'Three White Soldiers': { name: 'Three White Soldiers', type: 'BULLISH', score: 45 },
    'Three Black Crows': { name: 'Three Black Crows', type: 'BEARISH', score: 45 },
};

export const MARKET_STRUCTURE_TYPES: Record<string, string> = {
    'None': 'No clear structure',
    'Support': 'Key support level',
    'Resistance': 'Key resistance level',
    'Breakout': 'Breakout of resistance',
    'Breakdown': 'Breakdown of support',
};

export const NEWS_EVENTS: Record<string, NewsEvent> = {
    'None': { name: 'None', impact: 'Low' },
    'CPI Report': { name: 'CPI Report (USA)', impact: 'High' },
    'FOMC Statement': { name: 'FOMC Statement', impact: 'High' },
    'Non-Farm Payroll': { name: 'Non-Farm Payroll (USA)', impact: 'High' },
    'Retail Sales': { name: 'Retail Sales', impact: 'Medium' },
    'Bank Holiday': { name: 'Bank Holiday', impact: 'Low' },
};

export const MARKET_SENTIMENTS: Record<string, { call_factor: number, put_factor: number }> = {
    'Extreme Fear': { call_factor: 15, put_factor: -10 },
    'Fear': { call_factor: 10, put_factor: -5 },
    'Neutral': { call_factor: 0, put_factor: 0 },
    'Greed': { call_factor: -5, put_factor: 10 },
    'Extreme Greed': { call_factor: -10, put_factor: 15 },
};

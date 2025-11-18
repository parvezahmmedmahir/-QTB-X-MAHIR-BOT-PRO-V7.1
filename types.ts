export type Strategy = 'quantumfusion' | 'neuralmatrix' | 'vortex' | 'atomic' | 'sureshot';
export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';
export type MarketType = 'forex' | 'crypto' | 'commodities' | 'indices';
export type SignalResult = 'PENDING' | 'WIN' | 'LOSS';
export type TradingPair = string;

export interface Signal {
    id: number;
    time: string;
    pair: TradingPair;
    strategy: string;
    signal: 'CALL' | 'PUT';
    expiry: string;
    result: SignalResult;
    confidence?: number;
    indicatorsAtSignal?: TechnicalIndicators; // Store market state at time of signal
}

export interface StrategyDetail {
    name: string;
    description: string;
}

export interface MarketCondition {
    name: string;
    description: string;
    factor: number; // Multiplier for win probability
}

export interface CandlestickPattern {
    name: string;
}

export interface MarketStructure {
    type: string;
    level: number;
}

export interface NewsEvent {
    name: string;
    impact: 'Low' | 'Medium' | 'High';
}

export interface TechnicalIndicators {
    rsi: number;
    stoch: number;
    macdHistogram: number;
    // New advanced analysis concepts
    candlestickPattern: CandlestickPattern;
    marketStructure: MarketStructure;
    marketSentiment: keyof { "Extreme Fear": any, "Fear": any, "Neutral": any, "Greed": any, "Extreme Greed": any };
    newsEvent: NewsEvent;
}

export interface AnalysisResult {
    signal: 'CALL' | 'PUT';
    confidence: number;
    reasoning: string[];
    indicatorsAtSignal: TechnicalIndicators;
}

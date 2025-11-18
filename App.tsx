
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Signal, Strategy, RiskProfile, MarketType, TradingPair, SignalResult, MarketCondition, AnalysisResult, TechnicalIndicators } from './types';
import { STRATEGY_DETAILS, STRATEGY_WIN_RATES, PAIRS_BY_MARKET_TYPE, MARKET_CONDITIONS, CANDLESTICK_PATTERNS, MARKET_STRUCTURE_TYPES, NEWS_EVENTS, MARKET_SENTIMENTS } from './constants';

import Header from './components/Header';
import StatCard from './components/StatCard';
import ControlPanel from './components/ControlPanel';
import ChartPanel from './components/ChartPanel';
import SignalHistory from './components/SignalHistory';

// A more sophisticated, realistic analysis engine to replace the simple mock
const TechnicalAnalysisEngine = {
  analyze: (indicators: TechnicalIndicators, strategy: Strategy, risk: RiskProfile): AnalysisResult => {
      let callScore = 0;
      let putScore = 0;
      const reasoning: string[] = [];
      const riskFactors: string[] = [];

      // 1. Candlestick Pattern Analysis (High Impact)
      const patternInfo = CANDLESTICK_PATTERNS[indicators.candlestickPattern.name];
      if (patternInfo && patternInfo.name !== 'None') {
          if (patternInfo.type === 'BULLISH') {
              callScore += patternInfo.score;
              reasoning.push(`Bullish signal from '${patternInfo.name}' pattern.`);
          } else if (patternInfo.type === 'BEARISH') {
              putScore += patternInfo.score;
              reasoning.push(`Bearish signal from '${patternInfo.name}' pattern.`);
          }
      }

      // 2. Market Structure Analysis
      const structure = indicators.marketStructure;
      if (structure.type === 'Support') callScore += 25;
      if (structure.type === 'Resistance') putScore += 25;
      if (structure.type === 'Breakout') callScore += 35;
      if (structure.type === 'Breakdown') putScore += 35;
      if (structure.type !== 'None') {
        reasoning.push(`Price is interacting with a ${structure.type} zone at ${structure.level.toFixed(4)}.`);
      }

      // 3. Standard Indicator Confluence
      if (indicators.rsi < 30) callScore += 15;
      if (indicators.rsi > 70) putScore += 15;
      if (indicators.stoch < 20) callScore += 15;
      if (indicators.stoch > 80) putScore += 15;
      if (indicators.macdHistogram > 0) callScore += 10;
      if (indicators.macdHistogram < 0) putScore += 10;
      reasoning.push(`Indicators Analyzed: RSI(${indicators.rsi.toFixed(1)}), STOCH(${indicators.stoch.toFixed(1)}), MACD Hist(${indicators.macdHistogram.toFixed(4)})`);

      // 4. Market Sentiment
      const sentiment = MARKET_SENTIMENTS[indicators.marketSentiment];
      callScore += sentiment.call_factor;
      putScore += sentiment.put_factor;
      reasoning.push(`Market sentiment is ${indicators.marketSentiment}.`);

      // 5. Risk Factor Assessment
      if (indicators.newsEvent.impact === 'High') {
          riskFactors.push(`High-impact news event '${indicators.newsEvent.name}' approaching.`);
      }
      if (callScore > putScore && (structure.type === 'Resistance' || structure.type === 'Breakdown')) {
          riskFactors.push(`Potential CALL signal is against a bearish market structure.`);
      }
      if (putScore > callScore && (structure.type === 'Support' || structure.type === 'Breakout')) {
          riskFactors.push(`Potential PUT signal is against a bullish market structure.`);
      }
      
      const signal = callScore > putScore ? 'CALL' : 'PUT';
      const totalScore = callScore + putScore;
      let confidence = totalScore > 0 ? (Math.max(callScore, putScore) / totalScore) * 100 : 50;
      
      // Adjust confidence based on risk factors
      confidence -= riskFactors.length * 10;
      
      const riskMultiplier = risk === 'aggressive' ? 1.05 : risk === 'conservative' ? 0.95 : 1.0;
      confidence *= riskMultiplier;

      // Final confidence calculation, blending base win rate with analysis
      const baseWinRate = STRATEGY_WIN_RATES[strategy][risk] * 100;
      const finalConfidence = (confidence + baseWinRate) / 2;

      return {
          signal,
          confidence: Math.max(50, Math.min(finalConfidence, 98.0)),
          reasoning: [...reasoning, ...riskFactors].slice(0, 4),
          indicatorsAtSignal: indicators // Pass the state for realistic result confirmation
      };
  }
};


const App: React.FC = () => {
    const [strategy, setStrategy] = useState<Strategy>('quantumfusion');
    const [marketType, setMarketType] = useState<MarketType>('forex');
    const [tradingPair, setTradingPair] = useState<TradingPair>('EURUSD');
    const [riskProfile, setRiskProfile] = useState<RiskProfile>('aggressive');
    const [timeframe, setTimeframe] = useState<string>('1');

    const [signalHistory, setSignalHistory] = useState<Signal[]>([]);
    const [outputMessage, setOutputMessage] = useState<React.ReactNode>("INITIALIZING V7 CORE... READY FOR ANALYSIS.");
    const [logs, setLogs] = useState<string[]>(["[SYSTEM] V7.1 Engine Initialized"]);
    
    const [stats, setStats] = useState({
        wins: 0,
        losses: 0,
        winStreak: 0,
        activeSignals: 0,
        totalConfidence: 0,
    });

    const [isAutoMode, setIsAutoMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastSignalTime, setLastSignalTime] = useState<Date | null>(null);

    const [countdown, setCountdown] = useState(60);
    const autoModeIntervalRef = useRef<number | null>(null);
    const countdownIntervalRef = useRef<number | null>(null);

    const [marketCondition, setMarketCondition] = useState<MarketCondition>(MARKET_CONDITIONS[0]);
    const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicators>({
        rsi: 55,
        macdHistogram: 0.0001,
        stoch: 65,
        candlestickPattern: { name: 'None' },
        marketStructure: { type: 'None', level: 0 },
        marketSentiment: 'Neutral',
        newsEvent: { name: 'None', impact: 'Low' }
    });
    
    const addLog = useCallback((message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
    }, []);

    // Countdown Timer Effect
    useEffect(() => {
        countdownIntervalRef.current = window.setInterval(() => {
            setCountdown(prev => (prev > 1 ? prev - 1 : 60));
        }, 1000);

        return () => {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, []);
    
    // Realistic Market Simulation Effect
    useEffect(() => {
        const marketUpdateInterval = setInterval(() => {
            const candlePatternKeys = Object.keys(CANDLESTICK_PATTERNS);
            const randomCandlePattern = candlePatternKeys[Math.floor(Math.random() * candlePatternKeys.length)];

            const structureKeys = Object.keys(MARKET_STRUCTURE_TYPES);
            const randomStructure = structureKeys[Math.floor(Math.random() * structureKeys.length)];

            const newsKeys = Object.keys(NEWS_EVENTS);
            const randomNews = newsKeys[Math.floor(Math.random() * newsKeys.length)];

            const sentimentKeys = Object.keys(MARKET_SENTIMENTS);
            const randomSentiment = sentimentKeys[Math.floor(Math.random() * sentimentKeys.length)];

            setMarketCondition(MARKET_CONDITIONS[Math.floor(Math.random() * MARKET_CONDITIONS.length)]);
            setTechnicalIndicators({
                rsi: 20 + Math.random() * 60,
                stoch: 10 + Math.random() * 80,
                macdHistogram: (-0.001 + Math.random() * 0.002),
                candlestickPattern: { name: randomCandlePattern },
                marketStructure: { type: randomStructure, level: 1.0850 + (Math.random() * 0.01) },
                newsEvent: NEWS_EVENTS[randomNews],
                // FIX: Corrected the type assertion for marketSentiment to match the specific string literal union type required by the TechnicalIndicators interface.
                marketSentiment: randomSentiment as TechnicalIndicators['marketSentiment'],
            })
        }, 3000);
        return () => clearInterval(marketUpdateInterval);
    }, []);

    const handleGenerateSignal = useCallback(async (isSureShot = false) => {
        const now = new Date();
        if (lastSignalTime && (now.getTime() - lastSignalTime.getTime()) < 5000) {
            setOutputMessage(<div className="text-yellow-400">ANALYSIS COOLDOWN: Please wait a few seconds.</div>);
            addLog("⚠️ Signal generation blocked - in cooldown");
            return;
        }

        setIsLoading(true);
        const currentStrategy = isSureShot ? 'sureshot' : strategy;
        const currentRisk = isSureShot ? 'aggressive' : riskProfile;
        
        setStats(prev => ({...prev, activeSignals: prev.activeSignals + 1}));
        setOutputMessage(`QUERYING V7.1 ANALYSIS ENGINE...\nFOR ${tradingPair}...`);
        addLog(`🔥 Generating ${isSureShot ? 'Sure Shot ' : ''}signal for ${tradingPair}`);

        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = TechnicalAnalysisEngine.analyze(technicalIndicators, currentStrategy, currentRisk);
        
        // Sure Shot requires high confidence and low risk
        if (isSureShot && (result.confidence < 85 || result.reasoning.some(r => r.includes('risk')))) {
            setOutputMessage(<div><p className="font-bold text-lg mb-2 text-yellow-400">SURE SHOT CONDITION NOT MET</p><p className="text-xs">Insufficient confluence or high risk detected. No signal generated.</p></div>);
            addLog("🎯 Sure Shot conditions not met. Signal aborted.");
            setIsLoading(false);
            setStats(prev => ({...prev, activeSignals: Math.max(0, prev.activeSignals - 1)}));
            return;
        }

        const nextCandleTime = new Date(now);
        nextCandleTime.setSeconds(0);
        nextCandleTime.setMilliseconds(0);
        nextCandleTime.setMinutes(nextCandleTime.getMinutes() + 1);

        const newSignal: Signal = {
            id: Date.now(),
            time: nextCandleTime.toLocaleTimeString('en-US', { hour12: false }),
            pair: tradingPair,
            strategy: currentStrategy.toUpperCase(),
            signal: result.signal,
            expiry: `M${timeframe}`,
            result: 'PENDING',
            confidence: result.confidence,
            indicatorsAtSignal: result.indicatorsAtSignal
        };
        
        const signalMsg = (
            <div>
                <p className="font-bold text-lg mb-2">V7.1 ENGINE ANALYSIS COMPLETE</p>
                <div className="border-t border-b border-gray-700 py-2 my-2">
                    <p>PAIR: <span className="font-bold">{newSignal.pair}</span></p>
                    <p>DIRECTION: <span className={`font-bold ${newSignal.signal === 'CALL' ? 'text-green-400' : 'text-red-400'}`}>{newSignal.signal}</span></p>
                    <p>CONFIDENCE: <span className="font-bold text-blue-400">{result.confidence.toFixed(2)}%</span></p>
                </div>
                <p className="font-bold mt-2">REASONING:</p>
                <ul className="list-disc list-inside text-left text-xs">
                    {result.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            </div>
        );
        setOutputMessage(signalMsg);
        setSignalHistory(prev => [newSignal, ...prev]);
        setLastSignalTime(now);
        setStats(prev => ({...prev, totalConfidence: prev.totalConfidence + newSignal.confidence!}));

        setTimeout(() => confirmTradeResult(newSignal), 60000);

        setIsLoading(false);
    }, [strategy, riskProfile, tradingPair, lastSignalTime, addLog, timeframe, technicalIndicators]);
    
    const confirmTradeResult = (signal: Signal) => {
        let winProbability = (signal.confidence! / 100) * marketCondition.factor;
        const indicators = signal.indicatorsAtSignal!;

        // Apply realistic penalties based on the market state when the signal was generated
        if (signal.signal === 'CALL' && (indicators.marketStructure.type === 'Resistance' || indicators.marketStructure.type === 'Breakdown')) {
            winProbability *= 0.4; // Heavy penalty for trading against structure
        }
        if (signal.signal === 'PUT' && (indicators.marketStructure.type === 'Support' || indicators.marketStructure.type === 'Breakout')) {
            winProbability *= 0.4; // Heavy penalty for trading against structure
        }
        if (indicators.newsEvent.impact === 'High') {
            winProbability *= 0.6; // High risk during news
        }

        const result: SignalResult = Math.random() < winProbability ? 'WIN' : 'LOSS';
        
        setStats(prev => {
            const isWin = result === 'WIN';
            return {
                ...prev,
                wins: isWin ? prev.wins + 1 : prev.wins,
                losses: !isWin ? prev.losses + 1 : prev.losses,
                winStreak: isWin ? prev.winStreak + 1 : 0,
                activeSignals: Math.max(0, prev.activeSignals - 1),
            }
        });

        setSignalHistory(prev => prev.map(s => s.id === signal.id ? {...s, result} : s));
        addLog(`✅ Trade Result: ${result} on ${signal?.pair} (Confidence: ${signal.confidence!.toFixed(1)}%)`);
    };

    const handleToggleAutoMode = () => {
        setIsAutoMode(prev => {
            if (!prev) {
                addLog('🤖 Auto-Trading Protocol ENGAGED.');
                handleGenerateSignal();
                autoModeIntervalRef.current = window.setInterval(() => handleGenerateSignal(), 61000);
            } else {
                addLog('⏹️ Auto-Trading Protocol DISENGAGED.');
                if (autoModeIntervalRef.current) clearInterval(autoModeIntervalRef.current);
            }
            return !prev;
        });
    };
    
    useEffect(() => {
        setTradingPair(PAIRS_BY_MARKET_TYPE[marketType][0]);
    }, [marketType]);

    const totalSignals = stats.wins + stats.losses;
    const winRate = totalSignals > 0 ? Math.round((stats.wins / totalSignals) * 100) : 0;
    const avgConfidence = totalSignals > 0 ? (stats.totalConfidence / totalSignals).toFixed(2) : '0.00';

    
    let systemStatus = "ONLINE";
    let systemStatusColor = "text-text-primary";
    if (winRate >= 85) {
        systemStatus = "PEAK PERFORMANCE";
        systemStatusColor = "text-accent-green";
    } else if (winRate >= 75) {
        systemStatus = "STABLE";
        systemStatusColor = "text-accent-blue";
    } else if (totalSignals > 5 && winRate < 60) {
        systemStatus = "UNDERPERFORMING";
        systemStatusColor = "text-accent-yellow";
    }

    return (
        <div className="min-h-screen p-2 sm:p-5 font-sans relative">
            <div className="container mx-auto max-w-[1800px] relative z-10">
                <Header />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard title="Total Signals" value={signalHistory.length} icon="fa-bullhorn" />
                    <StatCard title="Win Rate" value={`${winRate}%`} icon="fa-trophy" />
                    <StatCard title="Current Streak" value={stats.winStreak} icon="fa-fire" />
                    <StatCard title="Avg. Confidence" value={`${avgConfidence}%`} icon="fa-brain" />
                    <StatCard title="Active Signals" value={stats.activeSignals} icon="fa-satellite-dish" />
                    <StatCard title="System Status" value={systemStatus} valueColor={systemStatusColor} icon="fa-server" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-1">
                       <ControlPanel
                            strategy={strategy}
                            setStrategy={setStrategy}
                            marketType={marketType}
                            setMarketType={setMarketType}
                            tradingPair={tradingPair}
                            setTradingPair={setTradingPair}
                            riskProfile={riskProfile}
                            setRiskProfile={setRiskProfile}
                            countdown={countdown}
                            technicalIndicators={technicalIndicators}
                            isLoading={isLoading}
                            isAutoMode={isAutoMode}
                            onGenerateSignal={handleGenerateSignal}
                            onToggleAutoMode={handleToggleAutoMode}
                            outputMessage={outputMessage}
                       />
                    </div>
                    <div className="lg:col-span-2">
                        <ChartPanel 
                            tradingPair={tradingPair}
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                            technicalIndicators={technicalIndicators}
                            logs={logs}
                        />
                    </div>
                </div>
                
                <SignalHistory signals={signalHistory} />
            </div>
        </div>
    );
};

export default App;

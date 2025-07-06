
export enum WarEndForecast {
    NotSoon = 'NOT_SOON',
    LikelySoon = 'LIKELY_SOON',
    LikelyVerySoon = 'LIKELY_VERY_SOON',
}

export enum FactorTrend {
    PositiveForUkraine = 'POSITIVE_FOR_UKRAINE',
    NegativeForUkraine = 'NEGATIVE_FOR_UKRAINE',
    Neutral = 'NEUTRAL',
}

export interface KeyFactor {
    title: string;
    impact: string;
    trend: FactorTrend;
}

export interface OutcomeProbability {
    ukraineVictory: number;
    stalemate: number;
    russiaVictory: number;
}

export interface AnalysisResponse {
    warEndForecast: WarEndForecast;
    keyFactors: KeyFactor[];
    outcomeProbability: OutcomeProbability;
}

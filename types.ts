
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
}

export interface Probabilities {
  ukraineVictory: number;
  frozenConflict: number;
  russiaVictory: number;
}

export type Forecast = 'Not Soon' | 'Likely Soon' | 'Likely Very Soon';

export interface AnalysisResult {
  prediction: Forecast;
  keyFactors: string[];
  probabilities: Probabilities;
}

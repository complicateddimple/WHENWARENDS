
export interface Source {
  uri: string;
  title: string;
}

export type TimelineCategory = 'NOT_SOON' | 'SOON' | 'VERY_SOON';

export interface OutcomeProbabilities {
    ukraineWin: number;
    frozenConflict: number;
    russiaWin: number;
}

export interface AnalysisResult {
  timelineCategory: TimelineCategory;
  timelineJustification: string;
  sources: Source[];
  outcomeProbabilities: OutcomeProbabilities;
}

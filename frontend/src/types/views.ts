export type levels = 'home' | 'ramo' | 'evaluacion';

export interface ViewState{
    level: levels;
    selectedRamo?: String | null;
    selectedEvaluacion?: String | null;  
}
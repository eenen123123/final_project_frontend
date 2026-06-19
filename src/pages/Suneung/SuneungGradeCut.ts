export interface SuneungGradeCut {
  id: number;
  year: number;
  examType: string;
  subject: string;
  grade: number;
  cutScore: number | null;
  people: number | null;
  ratio: number | null;
}

export interface DartsTournament {
  id: number;
  name: string;
  location: string;
  organisation: string;
  startDate: string;
  endDate: string;
  detailUrl: string;
  sourceUrl: string;
  scrapedAtUtc: string;
}

export type TournamentStatus = 'Upcoming' | 'Live' | 'Completed';

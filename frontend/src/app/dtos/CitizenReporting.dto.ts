export interface PaginatedCitizenReporting {
  results: CitizenReporting[];
  total: number;
}

export interface CitizenReporting {
  ssin: string;
  refMonth: number;
  data: { key: string, value: any }[];
}


export interface PaginatedCitizenReporting {
  results: CitizenReporting[];
  total: number;
}

export interface CitizenReporting {
  ssin: string;
  refMonth: number;
  data: { key: string, value: any }[];
  labels?: string;
  isLabelEditable: boolean | false;
  isIgnored: boolean | false;
}


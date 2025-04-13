export class ReportingPaginatedRequest {
  private params: Map<string, any>;
  private page: number;
  private size: number;
  private query: string;
  private includeIgnored: boolean;

  constructor(params?: Map<string, any>, page?: number, size?: number, query?: string, includeIgnored?: boolean) {
    this.params = params ? params : new Map<string, any>();
    this.page = page ? page : 0;
    this.size = size ? size : 50;
    this.query = query ? query : '';
    this.includeIgnored = includeIgnored ? includeIgnored : false;
  }

  toJSON() {
    return {
      params: this.mapToObject(this.params),
      page: this.page,
      size: this.size,
      query: this.query,
      includeIgnored: this.includeIgnored
    };
  }

  mapToObject(map: Map<string, any>): { [key: string]: any } {
    const obj: any = {};
    map.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }

  public getParams(): { [key: string]: any } {
    return this.params;
  }

  public getPage(): number {
    return this.page;
  }

  public getSize(): number {
    return this.size;
  }

  public getQuery(): string {
    return this.query;
  }

  public getIncludeIgnored(): boolean {
    return this.includeIgnored;
  }


}

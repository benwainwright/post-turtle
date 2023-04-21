export interface Field {
  name: string;
  replace: string;
  data: string;
}

export interface HttpRequestWithFields {
  body: Field[];
  host: Field[];
  path: Field[];
  headers: Record<string, Field[]>;
}

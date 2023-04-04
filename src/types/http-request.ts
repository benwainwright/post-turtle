import { HttpMethod } from "./http-method.js";

export interface HttpRequest {
  title: string;
  method: HttpMethod;
  host: string;
  path: string;
  headers?: Record<string, string>;
}

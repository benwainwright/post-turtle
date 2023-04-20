import { Header } from "./header.js";
import { HttpMethod } from "./http-method.js";

export interface HttpRequest {
  id: string;
  title: string;
  slug: string;
  method: HttpMethod;
  body?: string;
  host: string;
  path: string;
  headers?: Record<string, Header>;
}

import { HttpRequest } from "../types/http-request.js";

export const normaliseRequest = (request: HttpRequest): HttpRequest => {
  const path = request.path.startsWith("/")
    ? request.path.substring(1)
    : request.path;

  const host = request.host.endsWith("/")
    ? request.host.substring(0, request.host.length - 1)
    : request.host;

  return {
    ...request,
    path,
    host,
  };
};

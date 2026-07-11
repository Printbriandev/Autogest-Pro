import type { DashboardSummary } from "../../entities/dashboard";
import { httpClient } from "../../shared/api/httpClient";

export function getDashboardSummary() {
  return httpClient<DashboardSummary>("/api/reportes/dashboard");
}

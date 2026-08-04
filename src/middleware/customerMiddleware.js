import { roleMiddleware } from "./roleMiddleware";

export async function customerMiddleware(request) {
  return roleMiddleware(request, ["Customer"]);
}

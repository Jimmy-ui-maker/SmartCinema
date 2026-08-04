import { roleMiddleware } from "./roleMiddleware";

export async function cashierMiddleware(request) {
  return roleMiddleware(request, ["Cashier", "Admin"]);
}

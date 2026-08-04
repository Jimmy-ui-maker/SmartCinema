import { roleMiddleware } from "./roleMiddleware";

export async function adminMiddleware(request) {
  return roleMiddleware(request, ["Admin"]);
}

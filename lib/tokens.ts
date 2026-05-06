import crypto from "crypto";

export function createConfirmationToken() {
  return crypto.randomBytes(32).toString("hex");
}

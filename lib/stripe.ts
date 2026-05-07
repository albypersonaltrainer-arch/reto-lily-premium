import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
  }

  return webhookSecret;
}

export function normalizeDonationAmountToCents(amount: string) {
  const numericAmount = Number(
    amount
      .replace("€", "")
      .replace("$", "")
      .replace("USD", "")
      .replace("usd", "")
      .replace("@", "")
      .replace("＠", "")
      .replace("⭐", "")
      .trim()
  );

  if (!Number.isFinite(numericAmount) || numericAmount < 1) {
    throw new Error("Invalid donation amount");
  }

  return Math.round(numericAmount * 100);
}

export function getDonationLabel(amount: string) {
  const normalizedAmount = amount
    .replace("€", "")
    .replace("$", "")
    .replace("USD", "")
    .replace("usd", "")
    .replace("@", "")
    .replace("＠", "")
    .replace("⭐", "")
    .trim();

  const labels: Record<string, string> = {
    "7": "Solo curiosear",
    "17": "Quiero entender",
    "27": "Voy en serio",
    "47": "Estoy comprometid@ con mi cambio"
  };

  return labels[normalizedAmount] || "Aportación al reto";
}

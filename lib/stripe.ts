import Stripe from "stripe";

let stripeClient: Stripe | null = null;

const ALLOWED_DONATION_AMOUNTS: Record<
  string,
  {
    cents: number;
    label: string;
  }
> = {
  "7": {
    cents: 700,
    label: "Compromiso inicial"
  },
  "17": {
    cents: 1700,
    label: "Compromiso medio"
  },
  "27": {
    cents: 2700,
    label: "Compromiso profundo"
  },
  "47": {
    cents: 4700,
    label: "Compromiso total"
  }
};

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

function normalizeDonationAmount(amount: string) {
  return amount
    .replace("€", "")
    .replace("$", "")
    .replace("USD", "")
    .replace("usd", "")
    .replace("@", "")
    .replace("＠", "")
    .replace("⭐", "")
    .trim();
}

export function normalizeDonationAmountToCents(amount: string) {
  const normalizedAmount = normalizeDonationAmount(amount);
  const donation = ALLOWED_DONATION_AMOUNTS[normalizedAmount];

  if (!donation) {
    throw new Error("Invalid donation amount");
  }

  return donation.cents;
}

export function getDonationLabel(amount: string) {
  const normalizedAmount = normalizeDonationAmount(amount);
  const donation = ALLOWED_DONATION_AMOUNTS[normalizedAmount];

  return donation?.label || "Aportación al reto";
}

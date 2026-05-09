import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export type DonationOption = {
  amount: string;
  label: string;
};

const DEFAULT_ALLOWED_DONATION_OPTIONS: DonationOption[] = [
  {
    amount: "7$",
    label: "Compromiso inicial"
  },
  {
    amount: "17$",
    label: "Compromiso medio"
  },
  {
    amount: "27$",
    label: "Compromiso profundo"
  },
  {
    amount: "47$",
    label: "Compromiso total"
  }
];

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

function getNumericDonationAmount(amount: string) {
  const normalizedAmount = normalizeDonationAmount(amount);
  const numericAmount = Number(normalizedAmount);

  if (!Number.isFinite(numericAmount)) {
    return null;
  }

  return numericAmount;
}

function findDonationOption(
  amount: string,
  allowedOptions: DonationOption[] = DEFAULT_ALLOWED_DONATION_OPTIONS
) {
  const requestedAmount = getNumericDonationAmount(amount);

  if (!requestedAmount || requestedAmount < 1 || requestedAmount > 999) {
    return null;
  }

  return (
    allowedOptions.find((option) => {
      const optionAmount = getNumericDonationAmount(option.amount);

      return optionAmount === requestedAmount;
    }) || null
  );
}

export function normalizeDonationAmountToCents(
  amount: string,
  allowedOptions: DonationOption[] = DEFAULT_ALLOWED_DONATION_OPTIONS
) {
  const donation = findDonationOption(amount, allowedOptions);
  const numericAmount = getNumericDonationAmount(amount);

  if (!donation || !numericAmount) {
    throw new Error("Invalid donation amount");
  }

  return Math.round(numericAmount * 100);
}

export function getDonationLabel(
  amount: string,
  allowedOptions: DonationOption[] = DEFAULT_ALLOWED_DONATION_OPTIONS
) {
  const donation = findDonationOption(amount, allowedOptions);

  return donation?.label || "Aportación al reto";
}

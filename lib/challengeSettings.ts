import { challengeByLocale, type ChallengeCopy, type Locale } from "@/config/challenge";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type EditablePrice = {
  amount: string;
  label: string;
};

type EditableChallengeSettings = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroIntro?: string;
  videoUrl?: string;
  videoHelper?: string;
  coachText?: string;
  learnItems?: string[];
  testimonialsText?: string;
  prices?: EditablePrice[];
  whatsappUrl?: string;
  whatsappText?: string;
  showTestimonials?: boolean;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function sanitizeText(value: unknown, fallback: string) {
  return isNonEmptyString(value) ? value.trim() : fallback;
}

function sanitizeOptionalText(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function sanitizeBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeAmountToNumber(amount: string) {
  const normalized = amount
    .replace("€", "")
    .replace("$", "")
    .replace("USD", "")
    .replace("usd", "")
    .replace("@", "")
    .replace("＠", "")
    .replace("⭐", "")
    .trim();

  const numeric = Number(normalized);

  if (!Number.isFinite(numeric)) return null;

  return numeric;
}

function sanitizePrices(value: unknown, fallback: EditablePrice[]) {
  if (!Array.isArray(value)) return fallback;

  const cleaned = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const amount = "amount" in item ? item.amount : null;
      const label = "label" in item ? item.label : null;

      if (!isNonEmptyString(amount) || !isNonEmptyString(label)) return null;

      const numericAmount = normalizeAmountToNumber(amount);

      if (!numericAmount || numericAmount < 1 || numericAmount > 999) return null;

      return {
        amount: amount.trim(),
        label: label.trim()
      };
    })
    .filter((item): item is EditablePrice => Boolean(item));

  return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeLearnItems(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const cleaned = value
    .filter(isNonEmptyString)
    .map((item) => item.trim())
    .slice(0, 6);

  return cleaned.length > 0 ? cleaned : fallback;
}

function applyEditableSettings(
  baseCopy: ChallengeCopy,
  settings: EditableChallengeSettings
): ChallengeCopy {
  const prices = sanitizePrices(settings.prices, baseCopy.donation.options);
  const learnItems = sanitizeLearnItems(settings.learnItems, baseCopy.learn.items);
  const showTestimonials = sanitizeBoolean(settings.showTestimonials, true);

  return {
    ...baseCopy,
    hero: {
      ...baseCopy.hero,
      title: sanitizeText(settings.heroTitle, baseCopy.hero.title),
      subtitle: sanitizeText(settings.heroSubtitle, baseCopy.hero.subtitle),
      intro: sanitizeOptionalText(settings.heroIntro, baseCopy.hero.intro)
    },
    video: {
      ...baseCopy.video,
      url: sanitizeOptionalText(settings.videoUrl, baseCopy.video.url),
      helper: sanitizeText(settings.videoHelper, baseCopy.video.helper)
    },
    coach: {
      ...baseCopy.coach,
      text: sanitizeText(settings.coachText, baseCopy.coach.text)
    },
    learn: {
      ...baseCopy.learn,
      items: learnItems
    },
    donation: {
      ...baseCopy.donation,
      options: prices
    },
    testimonials: {
      ...baseCopy.testimonials,
      text: sanitizeText(settings.testimonialsText, baseCopy.testimonials.text),
      items: showTestimonials ? baseCopy.testimonials.items : []
    },
    whatsapp: {
      ...baseCopy.whatsapp,
      text: sanitizeText(settings.whatsappText, baseCopy.whatsapp.text),
      url: sanitizeText(settings.whatsappUrl, baseCopy.whatsapp.url)
    }
  };
}

export async function getEditableChallengeCopy(locale: Locale): Promise<ChallengeCopy> {
  const baseCopy = challengeByLocale[locale];

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("reto_lily_settings")
      .select("content_json, is_active")
      .eq("locale", locale)
      .eq("is_active", true)
      .single();

    if (error || !data?.content_json) {
      if (error) {
        console.error("Challenge settings lookup error:", error);
      }

      return baseCopy;
    }

    return applyEditableSettings(
      baseCopy,
      data.content_json as EditableChallengeSettings
    );
  } catch (error) {
    console.error("Challenge settings fallback error:", error);
    return baseCopy;
  }
}

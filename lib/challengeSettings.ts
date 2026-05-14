import { unstable_noStore as noStore } from "next/cache";
import { challengeByLocale, type ChallengeCopy, type Locale } from "@/config/challenge";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type EditablePrice = {
  amount: string;
  label: string;
};

type EditableTestimonialMediaKind = "none" | "image" | "video" | "audio";

type EditableTestimonial = {
  name: string;
  text: string;
  type: string;
  mediaKind: EditableTestimonialMediaKind;
  mediaUrl: string;
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
  testimonials?: EditableTestimonial[];
  prices?: EditablePrice[];
  whatsappUrl?: string;
  whatsappText?: string;
  showTestimonials?: boolean;
};

const DEFAULT_THREE_PRICES: EditablePrice[] = [
  { amount: "$7", label: "Quiero empezar" },
  { amount: "$27", label: "Voy en serio" },
  { amount: "$47", label: "Estoy comprometid@ con mi transformación" }
];

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
  const safeFallback = fallback.length >= 3 ? fallback.slice(0, 3) : DEFAULT_THREE_PRICES;

  if (!Array.isArray(value)) return safeFallback;

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
    .filter((item): item is EditablePrice => item !== null)
    .slice(0, 3);

  return cleaned.length === 3 ? cleaned : safeFallback;
}

function sanitizeLearnItems(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const cleaned = value
    .filter(isNonEmptyString)
    .map((item) => item.trim())
    .slice(0, 6);

  return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeMediaKind(value: unknown): EditableTestimonialMediaKind {
  if (
    value === "image" ||
    value === "video" ||
    value === "audio" ||
    value === "none"
  ) {
    return value;
  }

  return "none";
}

function sanitizeMediaUrl(value: unknown) {
  if (typeof value !== "string") return "";

  const trimmed = value.trim();

  if (!trimmed) return "";

  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  return "";
}

function sanitizeTestimonials(
  value: unknown,
  fallback: Array<{ name: string; text: string; type: string }>
): EditableTestimonial[] {
  const fallbackTestimonials: EditableTestimonial[] = fallback.map((item) => ({
    name: item.name,
    text: item.text,
    type: item.type,
    mediaKind: "none",
    mediaUrl: ""
  }));

  if (!Array.isArray(value)) return fallbackTestimonials;

  const cleaned = value
    .map((item, index): EditableTestimonial | null => {
      if (!item || typeof item !== "object") return null;

      const fallbackItem = fallbackTestimonials[index] || {
        name: `Testimonio ${index + 1}`,
        text: "",
        type: "Texto",
        mediaKind: "none" as EditableTestimonialMediaKind,
        mediaUrl: ""
      };

      const rawName = "name" in item ? item.name : null;
      const rawText = "text" in item ? item.text : null;
      const rawType = "type" in item ? item.type : null;
      const rawMediaKind = "mediaKind" in item ? item.mediaKind : null;
      const rawMediaUrl = "mediaUrl" in item ? item.mediaUrl : null;

      const name = sanitizeText(rawName, fallbackItem.name);
      const text = sanitizeText(rawText, fallbackItem.text);
      const type = sanitizeText(rawType, fallbackItem.type);
      const mediaKind = sanitizeMediaKind(rawMediaKind);
      const mediaUrl = sanitizeMediaUrl(rawMediaUrl);

      return {
        name,
        text,
        type,
        mediaKind: mediaUrl ? mediaKind : "none",
        mediaUrl
      };
    })
    .filter((item): item is EditableTestimonial => item !== null)
    .slice(0, 6);

  return cleaned.length > 0 ? cleaned : fallbackTestimonials;
}

function applyEditableSettings(
  baseCopy: ChallengeCopy,
  settings: EditableChallengeSettings
): ChallengeCopy {
  const prices = sanitizePrices(settings.prices, DEFAULT_THREE_PRICES);
  const learnItems = sanitizeLearnItems(settings.learnItems, baseCopy.learn.items);
  const showTestimonials = sanitizeBoolean(settings.showTestimonials, true);
  const testimonials = sanitizeTestimonials(
    settings.testimonials,
    baseCopy.testimonials.items
  );

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
      items: showTestimonials ? testimonials : []
    },
    whatsapp: {
      ...baseCopy.whatsapp,
      text: sanitizeText(settings.whatsappText, baseCopy.whatsapp.text),
      url: sanitizeText(settings.whatsappUrl, baseCopy.whatsapp.url)
    }
  };
}

export async function getEditableChallengeCopy(locale: Locale): Promise<ChallengeCopy> {
  noStore();

  const baseCopy = challengeByLocale[locale];

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("reto_lily_settings")
      .select("content_json, is_active, updated_at")
      .eq("locale", locale)
      .eq("is_active", true)
      .single();

    if (error || !data?.content_json) {
      if (error) {
        console.error("Challenge settings lookup error:", error);
      }

      return {
        ...baseCopy,
        donation: {
          ...baseCopy.donation,
          options: DEFAULT_THREE_PRICES
        }
      };
    }

    return applyEditableSettings(
      baseCopy,
      data.content_json as EditableChallengeSettings
    );
  } catch (error) {
    console.error("Challenge settings fallback error:", error);

    return {
      ...baseCopy,
      donation: {
        ...baseCopy.donation,
        options: DEFAULT_THREE_PRICES
      }
    };
  }
}

export type Locale = "es" | "en";

export type ChallengeCopy = {
  locale: Locale;
  slug: string;
  oppositeLocalePath: string;
  brand: string;
  brandLogo: string;
  navCta: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: string;
  };
  video: {
    url: string;
    placeholderText: string;
    helper: string;
    locked: string;
    unlockLabel: string;
    unlockAfterSeconds: number;
  };
  coach: {
    title: string;
    name: string;
    subtitle: string;
    text: string;
    image: string;
  };
  unlock: {
    title: string;
    lines: string[];
    cta: string;
    note: string;
  };
  countdown: {
    label: string;
    title: string;
    text: string;
    deadlineIso: string;
    urgencyMinutes: number;
  };
  donation: {
    title: string;
    subtitle: string;
    minimum: string;
    options: Array<{ amount: string; label: string }>;
    paymentMethods: {
      stripe: string;
      sumup: string;
    };
  };
  learn: {
    title: string;
    items: string[];
  };
  form: {
    title: string;
    text: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    amount: string;
    paymentMethod: string;
    privacy: string;
    submit: string;
    successTitle: string;
    successText: string;
    errorText: string;
  };
  testimonials: {
    title: string;
    text: string;
    items: Array<{ name: string; text: string; type: string }>;
  };
  whatsapp: {
    title: string;
    text: string;
    cta: string;
    url: string;
  };
  final: {
    title: string;
    text: string;
    cta: string;
  };
  footer: {
    legal: string;
    privacy: string;
    terms: string;
    contact: string;
  };
};

export const challengeByLocale: Record<Locale, ChallengeCopy> = {
  es: {
    locale: "es",
    slug: "reto-dinero",
    oppositeLocalePath: "/en/money-challenge",
    brand: "Lily Camarena",
    brandLogo: "/lily-camarena-logo.png",
    navCta: "Solicita tu acceso",
    hero: {
      eyebrow: "RETO DE 3 DÍAS",
      title: "Elimina lo que bloquea tu dinero en 3 días",
      subtitle: "Deja de intentar manifestar más y entiende por qué lo estás frenando.",
      intro: ""
    },
    video: {
      url: "",
      placeholderText: "Vídeo de Lily · versión española",
      helper:
        "Este vídeo dura menos de 10 minutos. Si de verdad quieres entender qué está pasando con tu dinero, míralo hasta el final.",
      locked: "El acceso al reto se desbloquea cuando termine la cuenta atrás.",
      unlockLabel: "El acceso al reto se desbloquea en:",
      unlockAfterSeconds: 120
    },
    coach: {
      title: "Lily Camarena",
      name: "Lily Camarena",
      subtitle: "Si hacer más fuera la solución, ya habrías cambiado.",
      text:
        "Lily acompaña a hombres y mujeres a trabajar en lo que sigue sosteniendo el mismo resultado, aunque lo estés intentando.",
      image: "/lily-camarena-logo.png"
    },
    unlock: {
      title: "Si has llegado hasta aquí, no es casualidad.",
      lines: [
        "No estás aquí por suerte.",
        "Algo en ti ya sabe que así no puedes seguir.",
        "Esto es la respuesta que estabas buscando.",
        "Ahora tú decides si haces algo con ello… o sigues igual."
      ],
      cta: "Solicita tu acceso",
      note: "Si de verdad quieres que esto te sirva, no elijas desde la duda."
    },
    countdown: {
      label: "Acceso abierto por tiempo limitado",
      title: "Este acceso no va a estar abierto siempre.",
      text: "Puedes seguir dándole vueltas… o puedes empezar ahora.",
      deadlineIso: "2026-12-31T23:59:59+01:00",
      urgencyMinutes: 30
    },
    donation: {
      title: "Esto no es un precio.",
      subtitle: "Es el nivel de compromiso que eliges contigo.",
      minimum: "Prueba técnica temporal: 1$. Después volverá al mínimo oficial de 7$.",
      options: [
        { amount: "1$", label: "Prueba técnica" }
      ],
      paymentMethods: {
        stripe: "https://stripe.com/",
        sumup: "https://pay.sumup.com/b2c/XA39W0D4C0"
      }
    },
    learn: {
      title: "En estos 3 días vas a:",
      items: [
        "Ver exactamente qué está bloqueando tu dinero ahora mismo",
        "Entender por qué sigues en el mismo punto aunque hagas cosas",
        "Cambiar la forma en la que te estás relacionando con el dinero de verdad, no en teoría",
        "Salir con un punto claro desde el que empezar a generar distinto"
      ]
    },
    form: {
      title: "Solicita tu acceso al reto",
      text:
        "Déjanos tus datos para confirmar tu acceso y enviarte las instrucciones definitivas por email.",
      fullName: "Nombre completo",
      email: "Email",
      phone: "WhatsApp / Teléfono",
      city: "Ciudad",
      country: "País",
      amount: "Elige tu aportación",
      paymentMethod: "Método de pago preferido",
      privacy: "Acepto la política de privacidad y el uso de mis datos para gestionar este reto.",
      submit: "Confirmar mi acceso",
      successTitle: "Solicitud recibida",
      successText: "Te hemos enviado un email para confirmar tu acceso. Revisa también spam o promociones.",
      errorText: "No hemos podido registrar tu solicitud. Revisa los datos e inténtalo de nuevo."
    },
    testimonials: {
      title: "Historias reales",
      text: "Mujeres que empezaron a mirar su relación con el dinero desde otro lugar.",
      items: [
        { name: "Testimonio 1", text: "Aquí irá una frase real de una alumna o clienta.", type: "Foto" },
        { name: "Testimonio 2", text: "Espacio preparado para texto o audio corto.", type: "Audio" },
        { name: "Testimonio 3", text: "Testimonio pendiente de añadir.", type: "Foto" }
      ]
    },
    whatsapp: {
      title: "¿Tienes dudas antes de entrar?",
      text: "Escríbenos por WhatsApp y te respondemos directo.",
      cta: "Hablar por WhatsApp",
      url: "https://wa.me/34686638097"
    },
    final: {
      title: "Esto no es para todo el mundo.",
      text: "Es para quien ya está cansada de intentar y no ver resultados.",
      cta: "Entrar al reto"
    },
    footer: {
      legal: "© 2026 Lily Camarena · Reto de transformación emocional",
      privacy: "Privacidad",
      terms: "Términos",
      contact: "Contacto"
    }
  },
  en: {
    locale: "en",
    slug: "money-challenge",
    oppositeLocalePath: "/es/reto-dinero",
    brand: "Lily Camarena",
    brandLogo: "/lily-camarena-logo.png",
    navCta: "Request access",
    hero: {
      eyebrow: "3-DAY CHALLENGE",
      title: "Remove what blocks your money in 3 days",
      subtitle: "Stop trying to manifest more and understand why you may be holding it back.",
      intro: ""
    },
    video: {
      url: "",
      placeholderText: "Lily video · English version",
      helper:
        "This video is under 10 minutes. If you truly want to understand what is happening with your money, watch it until the end.",
      locked: "Access to the challenge unlocks when the countdown finishes.",
      unlockLabel: "Access to the challenge unlocks in:",
      unlockAfterSeconds: 120
    },
    coach: {
      title: "Lily Camarena",
      name: "Lily Camarena",
      subtitle: "If doing more were the solution, you would have changed already.",
      text:
        "Lily supports men and women in working on what keeps sustaining the same result, even when they are trying.",
      image: "/lily-camarena-logo.png"
    },
    unlock: {
      title: "If you made it this far, it is not random.",
      lines: [
        "You are not here by chance.",
        "Something in you already knows you cannot continue like this.",
        "This is the answer you were looking for.",
        "Now you decide whether you act on it… or stay the same."
      ],
      cta: "Request access",
      note: "If you truly want this to serve you, do not choose from doubt."
    },
    countdown: {
      label: "Access open for a limited time",
      title: "This access will not stay open forever.",
      text: "You can keep overthinking it… or you can start now.",
      deadlineIso: "2026-12-31T23:59:59+01:00",
      urgencyMinutes: 30
    },
    donation: {
      title: "This is not a price.",
      subtitle: "It is the level of commitment you choose for yourself.",
      minimum: "Temporary technical test: $1. After testing, the official minimum will return to $7.",
      options: [
        { amount: "$1", label: "Technical test" }
      ],
      paymentMethods: {
        stripe: "https://stripe.com/",
        sumup: "https://pay.sumup.com/b2c/XA39W0D4C0"
      }
    },
    learn: {
      title: "In these 3 days you will:",
      items: [
        "See exactly what is blocking your money right now",
        "Understand why you remain in the same place even when you take action",
        "Change the way you are relating to money for real, not just in theory",
        "Leave with a clear starting point from which to begin creating differently"
      ]
    },
    form: {
      title: "Request your access to the challenge",
      text: "Leave your details so we can confirm your access and send the final instructions by email.",
      fullName: "Full name",
      email: "Email",
      phone: "WhatsApp / Phone",
      city: "City",
      country: "Country",
      amount: "Choose your contribution",
      paymentMethod: "Preferred payment method",
      privacy: "I accept the privacy policy and the use of my data to manage this challenge.",
      submit: "Confirm my access",
      successTitle: "Request received",
      successText: "We have sent you an email to confirm your access. Please also check spam or promotions.",
      errorText: "We could not register your request. Please review your details and try again."
    },
    testimonials: {
      title: "Real stories",
      text: "Women who started looking at their relationship with money from a different place.",
      items: [
        { name: "Story 1", text: "A real client sentence will go here.", type: "Photo" },
        { name: "Story 2", text: "Prepared space for a short text or audio.", type: "Audio" },
        { name: "Story 3", text: "Testimonial pending.", type: "Photo" }
      ]
    },
    whatsapp: {
      title: "Questions before joining?",
      text: "Message us on WhatsApp and we will reply directly.",
      cta: "Talk on WhatsApp",
      url: "https://wa.me/34686638097"
    },
    final: {
      title: "This is not for everyone.",
      text: "It is for those who are tired of trying and not seeing results.",
      cta: "Enter the challenge"
    },
    footer: {
      legal: "© 2026 Lily Camarena · Emotional transformation challenge",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact"
    }
  }
};

export function getChallenge(locale: string, slug: string) {
  if (locale !== "es" && locale !== "en") return null;
  const challenge = challengeByLocale[locale];
  return challenge.slug === slug ? challenge : null;
}

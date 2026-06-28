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
    slug: "elreto",
    oppositeLocalePath: "/en/the-challenge",
    brand: "Lily Camarena",
    brandLogo: "/stamp_negro.png",
    navCta: "Acceder ahora",
    hero: {
      eyebrow: "",
      title: "EL RETO",
      subtitle: "No estás creando desde donde crees que estás creando.",
      intro: "Si hacer más fuera la solución, ya habrías cambiado. Descubre por qué sigues obteniendo los mismos resultados aunque lleves tiempo intentando cambiar."
    },
    video: {
      url: "",
      placeholderText: "Vídeo de Lily · versión española",
      helper: "Antes de continuar, mira este breve vídeo donde te explico cómo funciona el reto.",
      locked: "Antes de continuar, mira este breve vídeo donde te explico cómo funciona el reto.",
      unlockLabel: "El acceso se desbloquea en:",
      unlockAfterSeconds: 120
    },
    coach: {
      title: "Lily Camarena",
      name: "Lily Camarena",
      subtitle: "Si hacer más fuera la solución, ya habrías cambiado.",
      text:
        "Soy esa coach que te ayuda a romper los patrones que siguen frenando tu siguiente nivel… para que por fin puedas crear la abundancia, el éxito y los resultados que sabes que estás destinad@ a tener.",
      image: "/stamp_negro.png"
    },
    unlock: {
      title: "Esto no va de conseguir otra técnica. Va de ver lo que todavía no estabas viendo.",
      lines: [
        "Puedes seguir acumulando información.",
        "O puedes empezar a mirar el lugar real desde el que estás creando tus resultados.",
        "No estás creando desde donde crees que estás creando.",
        "Mientras sigas jugando con el mismo personaje, tu realidad tenderá a parecerse a la anterior."
      ],
      cta: "Acceder ahora",
      note: "Si de verdad quieres que esto te sirva, no elijas desde la duda."
    },
    countdown: {
      label: "Tiempo limitado",
      title: "Este acceso no va a estar abierto siempre.",
      text: "Puedes seguir dándole vueltas… o puedes empezar ahora.",
      deadlineIso: "2026-12-31T23:59:59+01:00",
      urgencyMinutes: 30
    },
    donation: {
      title: "Acceso al reto",
      subtitle: "Reto online de 3 días",
      minimum: "Acceso completo al reto online de 3 días. Acceso inmediato tras la inscripción. Acceso disponible durante 1 año.",
      options: [
        { amount: "$27", label: "Acceso completo" }
      ],
      paymentMethods: {
        stripe: "https://stripe.com/",
        sumup: "https://pay.sumup.com/b2c/XA39W0D4C0"
      }
    },
    learn: {
      title: "Qué vivirás en El Reto",
      items: [
        "Día 1 · El personaje determina la realidad que experimentas. Descubrirás por qué sigues viviendo experiencias parecidas y cómo el personaje desde el que operas las mantiene.",
        "Día 2 · Tu personaje interpreta la realidad. Descubrirás que no reaccionas a la realidad, sino a la interpretación que hace tu personaje de ella.",
        "Día 3 · No necesitas esforzarte más. Empezarás a elegir conscientemente el personaje desde el que quieres vivir una realidad diferente."
      ]
    },
    form: {
      title: "Solicita tu acceso",
      text:
        "Déjanos tus datos para confirmar tu acceso y enviarte las instrucciones definitivas por email.",
      fullName: "Nombre completo",
      email: "Email",
      phone: "WhatsApp / Teléfono",
      city: "Ciudad",
      country: "País",
      amount: "Acceso al reto",
      paymentMethod: "Método de pago preferido",
      privacy:
        "Acepto la política de privacidad y los términos y condiciones para gestionar mi acceso.",
      submit: "Acceder ahora",
      successTitle: "Solicitud recibida",
      successText:
        "Solicitud recibida. Te estamos llevando a la página segura de pago.",
      errorText:
        "No hemos podido registrar tu solicitud. Revisa los datos e inténtalo de nuevo."
    },
    testimonials: {
      title: "Historias reales",
      text:
        "Personas que dejaron de operar desde la carencia, el miedo o el autosabotaje… y empezaron a manifestar más dinero, más oportunidades y una realidad mucho más alineada con lo que realmente querían vivir.",
      items: [
        {
          name: "Testimonio 1",
          text: "Aquí irá una frase real de una alumna o clienta.",
          type: "Foto"
        },
        {
          name: "Testimonio 2",
          text: "Espacio preparado para texto o audio corto.",
          type: "Audio"
        },
        {
          name: "Testimonio 3",
          text: "Testimonio pendiente de añadir.",
          type: "Foto"
        }
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
      text: "Es para quien ya está cansad@ de esforzarse… y no ver resultados.",
      cta: "Acceder ahora"
    },
    footer: {
      legal: "© 2026 Lily Camarena · EL RETO",
      privacy: "Privacidad",
      terms: "Términos",
      contact: "Contacto"
    }
  },
  en: {
    locale: "en",
    slug: "the-challenge",
    oppositeLocalePath: "/es/elreto",
    brand: "Lily Camarena",
    brandLogo: "/stamp_negro.png",
    navCta: "Access now",
    hero: {
      eyebrow: "",
      title: "THE CHALLENGE",
      subtitle: "You are not creating from where you think you are creating.",
      intro: "If doing more were the solution, you would have changed already. Discover why you keep getting the same results even though you have been trying to change."
    },
    video: {
      url: "",
      placeholderText: "Lily video · English version",
      helper: "Before continuing, watch this short video where I explain how the challenge works.",
      locked: "Before continuing, watch this short video where I explain how the challenge works.",
      unlockLabel: "Access unlocks in:",
      unlockAfterSeconds: 120
    },
    coach: {
      title: "Lily Camarena",
      name: "Lily Camarena",
      subtitle: "If doing more were the solution, you would have changed already.",
      text:
        "I am the coach who helps you break the patterns that keep holding back your next level… so you can finally create the abundance, success and results you know you are destined to have.",
      image: "/stamp_negro.png"
    },
    unlock: {
      title: "If you made it this far, it is not random.",
      lines: [
        "You are not here by chance.",
        "Something in you already knows you cannot continue like this.",
        "This is the answer you were looking for.",
        "Now you decide whether you act on it… or stay the same."
      ],
      cta: "Access now",
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
      minimum:
        "The minimum is $7. You can contribute more if you truly want to commit to your change.",
      options: [
        { amount: "$27", label: "Full access" }
      ],
      paymentMethods: {
        stripe: "https://stripe.com/",
        sumup: "https://pay.sumup.com/b2c/XA39W0D4C0"
      }
    },
    learn: {
      title: "In these 3 days you will:",
      items: [
        "Discover what is making you keep manifesting scarcity and limitation even though you want more for your life.",
        "Learn to stop manifesting from fear, need or survival so you can start generating from a different place.",
        "Open space for more money, more opportunities and a reality more aligned with what you truly want to create."
      ]
    },
    form: {
      title: "Request your access",
      text:
        "Leave your details so we can confirm your access and send the final instructions by email.",
      fullName: "Full name",
      email: "Email",
      phone: "WhatsApp / Phone",
      city: "City",
      country: "Country",
      amount: "Choose your contribution",
      paymentMethod: "Preferred payment method",
      privacy:
        "I accept the privacy policy and the terms and conditions to manage my access.",
      submit: "Access now",
      successTitle: "Request received",
      successText:
        "Request received. We are taking you to the secure payment page.",
      errorText:
        "We could not register your request. Please review your details and try again."
    },
    testimonials: {
      title: "Real stories",
      text:
        "People who stopped operating from lack, fear or self-sabotage… and started manifesting more money, more opportunities and a reality much more aligned with what they truly wanted to live.",
      items: [
        {
          name: "Story 1",
          text: "A real client sentence will go here.",
          type: "Photo"
        },
        {
          name: "Story 2",
          text: "Prepared space for a short text or audio.",
          type: "Audio"
        },
        {
          name: "Story 3",
          text: "Testimonial pending.",
          type: "Photo"
        }
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
      text: "It is for those who are tired of making an effort… and not seeing results.",
      cta: "Access now"
    },
    footer: {
      legal: "© 2026 Lily Camarena · THE CHALLENGE",
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
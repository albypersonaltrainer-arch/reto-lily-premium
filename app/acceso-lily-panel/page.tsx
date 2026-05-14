"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type PriceOption = {
  amount: string;
  label: string;
};

type TestimonialMediaKind = "none" | "image" | "video" | "audio";

type TestimonialItem = {
  name: string;
  text: string;
  type: string;
  mediaKind: TestimonialMediaKind;
  mediaUrl: string;
};

type PanelContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  videoUrl: string;
  videoHelper: string;
  coachText: string;
  learnItems: string[];
  testimonialsText: string;
  testimonials: TestimonialItem[];
  prices: PriceOption[];
  whatsappUrl: string;
  whatsappText: string;
  showTestimonials: boolean;
};

type ApiResponse = {
  ok: boolean;
  error?: string;
  message?: string;
  content?: PanelContent;
  updatedAt?: string;
};

type UploadResponse = {
  ok: boolean;
  error?: string;
  bucket?: string;
  path?: string;
  token?: string;
  signedUrl?: string;
  publicUrl?: string;
  mediaKind?: TestimonialMediaKind;
  mimeType?: string;
};

const EMPTY_CONTENT: PanelContent = {
  heroTitle: "",
  heroSubtitle: "",
  heroIntro: "",
  videoUrl: "",
  videoHelper: "",
  coachText: "",
  learnItems: ["", "", ""],
  testimonialsText: "",
  testimonials: [
    {
      name: "Testimonio 1",
      text: "Aquí irá una frase real de una alumna o clienta.",
      type: "Imagen",
      mediaKind: "none",
      mediaUrl: ""
    },
    {
      name: "Testimonio 2",
      text: "Espacio preparado para texto o audio corto.",
      type: "Audio",
      mediaKind: "none",
      mediaUrl: ""
    },
    {
      name: "Testimonio 3",
      text: "Testimonio pendiente de añadir.",
      type: "Vídeo",
      mediaKind: "none",
      mediaUrl: ""
    }
  ],
  prices: [
    { amount: "$7", label: "Quiero empezar" },
    { amount: "$27", label: "Voy en serio" },
    { amount: "$47", label: "Estoy comprometid@ con mi transformación" }
  ],
  whatsappUrl: "https://wa.me/34686638097",
  whatsappText: "",
  showTestimonials: true
};

const MAX_VIDEO_SIZE_BYTES = 524288000;
const MAX_TESTIMONIAL_FILE_SIZE_BYTES = 209715200;

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v"
];

const ALLOWED_TESTIMONIAL_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/x-wav"
];

function normalizeTestimonial(item: Partial<TestimonialItem> | undefined, index: number): TestimonialItem {
  const fallback = EMPTY_CONTENT.testimonials[index] || {
    name: `Testimonio ${index + 1}`,
    text: "",
    type: "Texto",
    mediaKind: "none" as TestimonialMediaKind,
    mediaUrl: ""
  };

  const mediaKind =
    item?.mediaKind === "image" ||
    item?.mediaKind === "video" ||
    item?.mediaKind === "audio" ||
    item?.mediaKind === "none"
      ? item.mediaKind
      : fallback.mediaKind;

  return {
    name: item?.name || fallback.name,
    text: item?.text || fallback.text,
    type: item?.type || fallback.type,
    mediaKind,
    mediaUrl: item?.mediaUrl || fallback.mediaUrl
  };
}

function normalizeContent(content: Partial<PanelContent> | null | undefined): PanelContent {
  return {
    heroTitle: content?.heroTitle || EMPTY_CONTENT.heroTitle,
    heroSubtitle: content?.heroSubtitle || EMPTY_CONTENT.heroSubtitle,
    heroIntro: content?.heroIntro || EMPTY_CONTENT.heroIntro,
    videoUrl: content?.videoUrl || EMPTY_CONTENT.videoUrl,
    videoHelper: content?.videoHelper || EMPTY_CONTENT.videoHelper,
    coachText: content?.coachText || EMPTY_CONTENT.coachText,
    learnItems:
      Array.isArray(content?.learnItems) && content.learnItems.length > 0
        ? [...content.learnItems, "", "", "", "", "", ""].slice(0, 6)
        : EMPTY_CONTENT.learnItems,
    testimonialsText: content?.testimonialsText || EMPTY_CONTENT.testimonialsText,
    testimonials:
      Array.isArray(content?.testimonials) && content.testimonials.length > 0
        ? [0, 1, 2].map((index) => normalizeTestimonial(content.testimonials?.[index], index))
        : EMPTY_CONTENT.testimonials,
    prices:
      Array.isArray(content?.prices) && content.prices.length > 0
        ? [...content.prices, ...EMPTY_CONTENT.prices].slice(0, 3)
        : EMPTY_CONTENT.prices,
    whatsappUrl: content?.whatsappUrl || EMPTY_CONTENT.whatsappUrl,
    whatsappText: content?.whatsappText || EMPTY_CONTENT.whatsappText,
    showTestimonials:
      typeof content?.showTestimonials === "boolean"
        ? content.showTestimonials
        : EMPTY_CONTENT.showTestimonials
  };
}

function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las variables públicas de Supabase.");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function formatFileSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

function FieldLabel({
  title,
  helper
}: {
  title: string;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-black uppercase tracking-[0.22em] text-champagne">
        {title}
      </span>
      {helper ? (
        <span className="mt-2 block text-sm leading-6 text-muted">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function SectionCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel pattern-card rounded-[2rem] border-champagne/25 p-6 shadow-soft md:p-8">
      <div className="mb-7">
        <h2 className="font-serif text-3xl leading-tight text-linen md:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3 text-sm leading-6 text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs = 18000
) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function LilyAdminPanelPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const testimonialFileInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [secret, setSecret] = useState("");
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [content, setContent] = useState<PanelContent>(EMPTY_CONTENT);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoUploadStatus, setVideoUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [videoUploadMessage, setVideoUploadMessage] = useState("");

  const [selectedTestimonialFiles, setSelectedTestimonialFiles] = useState<Record<number, File | null>>({});
  const [testimonialUploadStatus, setTestimonialUploadStatus] = useState<Record<number, "idle" | "uploading" | "success" | "error">>({});
  const [testimonialUploadMessages, setTestimonialUploadMessages] = useState<Record<number, string>>({});

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      locale,
      secret
    });

    return `/api/admin/reto-lily-settings?${params.toString()}`;
  }, [locale, secret]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secretFromUrl = params.get("secret") || "";
    const savedSecret = window.localStorage.getItem("lily_admin_secret") || "";

    if (secretFromUrl) {
      setSecret(secretFromUrl);
      window.localStorage.setItem("lily_admin_secret", secretFromUrl);

      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, "", cleanUrl);
      return;
    }

    if (savedSecret) {
      setSecret(savedSecret);
    }
  }, []);

  useEffect(() => {
    if (!secret) return;

    async function loadSettings() {
      setStatus("loading");
      setMessage("Cargando configuración...");

      try {
        const response = await fetchWithTimeout(apiUrl, {
          method: "GET",
          cache: "no-store"
        });

        const result = (await response.json().catch(() => null)) as ApiResponse | null;

        if (!response.ok || !result?.ok || !result.content) {
          throw new Error(result?.error || "No se pudo cargar la configuración.");
        }

        setContent(normalizeContent(result.content));
        setUpdatedAt(result.updatedAt || null);
        setStatus("idle");
        setMessage("");
      } catch (error) {
        console.error("Lily admin load error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "No se pudo cargar la configuración."
        );
      }
    }

    loadSettings();
  }, [apiUrl, secret]);

  function updateContent<K extends keyof PanelContent>(key: K, value: PanelContent[K]) {
    setContent((current) => ({
      ...current,
      [key]: value
    }));

    if (status === "success") {
      setStatus("idle");
      setMessage("");
    }
  }

  function updateLearnItem(index: number, value: string) {
    setContent((current) => {
      const nextItems = [...current.learnItems];
      nextItems[index] = value;

      return {
        ...current,
        learnItems: nextItems
      };
    });

    if (status === "success") {
      setStatus("idle");
      setMessage("");
    }
  }

  function updatePrice(index: number, field: keyof PriceOption, value: string) {
    setContent((current) => {
      const nextPrices = [...current.prices];
      nextPrices[index] = {
        ...nextPrices[index],
        [field]: value
      };

      return {
        ...current,
        prices: nextPrices
      };
    });

    if (status === "success") {
      setStatus("idle");
      setMessage("");
    }
  }

  function updateTestimonial(index: number, field: keyof TestimonialItem, value: string) {
    setContent((current) => {
      const nextTestimonials = [...current.testimonials];

      nextTestimonials[index] = {
        ...nextTestimonials[index],
        [field]: value
      };

      return {
        ...current,
        testimonials: nextTestimonials
      };
    });

    if (status === "success") {
      setStatus("idle");
      setMessage("");
    }
  }

  function clearTestimonialMedia(index: number) {
    setContent((current) => {
      const nextTestimonials = [...current.testimonials];

      nextTestimonials[index] = {
        ...nextTestimonials[index],
        mediaKind: "none",
        mediaUrl: "",
        type: "Texto"
      };

      return {
        ...current,
        testimonials: nextTestimonials
      };
    });

    setSelectedTestimonialFiles((current) => ({
      ...current,
      [index]: null
    }));

    setTestimonialUploadStatus((current) => ({
      ...current,
      [index]: "idle"
    }));

    setTestimonialUploadMessages((current) => ({
      ...current,
      [index]: "Archivo quitado de este testimonio. Pulsa “Guardar cambios” para aplicarlo en la landing."
    }));

    if (testimonialFileInputRefs.current[index]) {
      testimonialFileInputRefs.current[index]!.value = "";
    }

    if (status === "success") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextSecret = String(formData.get("secret") || "").trim();

    if (!nextSecret) {
      setStatus("error");
      setMessage("Introduce la clave privada del panel.");
      return;
    }

    window.localStorage.setItem("lily_admin_secret", nextSecret);
    setSecret(nextSecret);
    setMessage("");
  }

  async function handleVideoUpload() {
    if (!selectedVideoFile) {
      setVideoUploadStatus("error");
      setVideoUploadMessage("Selecciona primero un archivo de vídeo.");
      return;
    }

    if (!ALLOWED_VIDEO_TYPES.includes(selectedVideoFile.type)) {
      setVideoUploadStatus("error");
      setVideoUploadMessage("Formato no permitido. Usa MP4, WEBM, MOV o M4V.");
      return;
    }

    if (selectedVideoFile.size > MAX_VIDEO_SIZE_BYTES) {
      setVideoUploadStatus("error");
      setVideoUploadMessage("El vídeo supera el límite máximo de 500 MB.");
      return;
    }

    setVideoUploadStatus("uploading");
    setVideoUploadMessage("Preparando subida segura...");

    try {
      const prepareResponse = await fetchWithTimeout("/api/admin/reto-lily-video-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          secret,
          fileName: selectedVideoFile.name,
          fileType: selectedVideoFile.type,
          fileSize: selectedVideoFile.size
        })
      });

      const prepareResult = (await prepareResponse.json().catch(() => null)) as UploadResponse | null;

      if (
        !prepareResponse.ok ||
        !prepareResult?.ok ||
        !prepareResult.bucket ||
        !prepareResult.path ||
        !prepareResult.token ||
        !prepareResult.publicUrl
      ) {
        throw new Error(prepareResult?.error || "No se pudo preparar la subida del vídeo.");
      }

      setVideoUploadMessage("Subiendo vídeo a Supabase Storage...");

      const supabase = getSupabaseBrowserClient();

      const { error: uploadError } = await supabase.storage
        .from(prepareResult.bucket)
        .uploadToSignedUrl(
          prepareResult.path,
          prepareResult.token,
          selectedVideoFile,
          {
            contentType: selectedVideoFile.type,
            upsert: false
          }
        );

      if (uploadError) {
        console.error("Supabase video upload error:", uploadError);
        throw new Error("No se pudo subir el vídeo.");
      }

      updateContent("videoUrl", prepareResult.publicUrl);
      setSelectedVideoFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setVideoUploadStatus("success");
      setVideoUploadMessage(
        "Vídeo subido correctamente. La URL se ha pegado automáticamente. Pulsa “Guardar cambios” para publicarlo en la landing."
      );
    } catch (error) {
      console.error("Video upload error:", error);
      setVideoUploadStatus("error");
      setVideoUploadMessage(
        error instanceof Error
          ? error.message
          : "No se pudo subir el vídeo."
      );
    }
  }

  async function handleTestimonialUpload(index: number) {
    const selectedFile = selectedTestimonialFiles[index];

    if (!selectedFile) {
      setTestimonialUploadStatus((current) => ({ ...current, [index]: "error" }));
      setTestimonialUploadMessages((current) => ({
        ...current,
        [index]: "Selecciona primero un archivo."
      }));
      return;
    }

    if (!ALLOWED_TESTIMONIAL_FILE_TYPES.includes(selectedFile.type)) {
      setTestimonialUploadStatus((current) => ({ ...current, [index]: "error" }));
      setTestimonialUploadMessages((current) => ({
        ...current,
        [index]: "Formato no permitido. Usa imagen, vídeo o audio compatible."
      }));
      return;
    }

    if (selectedFile.size > MAX_TESTIMONIAL_FILE_SIZE_BYTES) {
      setTestimonialUploadStatus((current) => ({ ...current, [index]: "error" }));
      setTestimonialUploadMessages((current) => ({
        ...current,
        [index]: "El archivo supera el límite máximo de 200 MB."
      }));
      return;
    }

    setTestimonialUploadStatus((current) => ({ ...current, [index]: "uploading" }));
    setTestimonialUploadMessages((current) => ({
      ...current,
      [index]: "Preparando subida segura..."
    }));

    try {
      const prepareResponse = await fetchWithTimeout("/api/admin/reto-lily-testimonial-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          secret,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
          testimonialIndex: index
        })
      });

      const prepareResult = (await prepareResponse.json().catch(() => null)) as UploadResponse | null;

      if (
        !prepareResponse.ok ||
        !prepareResult?.ok ||
        !prepareResult.bucket ||
        !prepareResult.path ||
        !prepareResult.token ||
        !prepareResult.publicUrl ||
        !prepareResult.mediaKind
      ) {
        throw new Error(prepareResult?.error || "No se pudo preparar la subida del archivo.");
      }

      setTestimonialUploadMessages((current) => ({
        ...current,
        [index]: "Subiendo archivo a Supabase Storage..."
      }));

      const supabase = getSupabaseBrowserClient();

      const { error: uploadError } = await supabase.storage
        .from(prepareResult.bucket)
        .uploadToSignedUrl(
          prepareResult.path,
          prepareResult.token,
          selectedFile,
          {
            contentType: selectedFile.type,
            upsert: false
          }
        );

      if (uploadError) {
        console.error("Supabase testimonial upload error:", uploadError);
        throw new Error("No se pudo subir el archivo.");
      }

      updateTestimonial(index, "mediaUrl", prepareResult.publicUrl);
      updateTestimonial(index, "mediaKind", prepareResult.mediaKind);
      updateTestimonial(
        index,
        "type",
        prepareResult.mediaKind === "image"
          ? "Imagen"
          : prepareResult.mediaKind === "video"
            ? "Vídeo"
            : "Audio"
      );

      setSelectedTestimonialFiles((current) => ({ ...current, [index]: null }));

      if (testimonialFileInputRefs.current[index]) {
        testimonialFileInputRefs.current[index]!.value = "";
      }

      setTestimonialUploadStatus((current) => ({ ...current, [index]: "success" }));
      setTestimonialUploadMessages((current) => ({
        ...current,
        [index]: "Archivo subido correctamente. Pulsa “Guardar cambios” para publicarlo en la landing."
      }));
    } catch (error) {
      console.error("Testimonial upload error:", error);
      setTestimonialUploadStatus((current) => ({ ...current, [index]: "error" }));
      setTestimonialUploadMessages((current) => ({
        ...current,
        [index]: error instanceof Error ? error.message : "No se pudo subir el archivo."
      }));
    }
  }

  async function reloadSettingsAfterSave() {
    const params = new URLSearchParams({
      locale,
      secret
    });

    const response = await fetchWithTimeout(`/api/admin/reto-lily-settings?${params.toString()}`, {
      method: "GET",
      cache: "no-store"
    });

    const result = (await response.json().catch(() => null)) as ApiResponse | null;

    if (!response.ok || !result?.ok || !result.content) {
      throw new Error(result?.error || "Guardado realizado, pero no se pudo recargar la configuración.");
    }

    setContent(normalizeContent(result.content));
    setUpdatedAt(result.updatedAt || null);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("saving");
    setMessage("Guardando cambios...");

    const cleanContent: PanelContent = {
      ...content,
      heroTitle: content.heroTitle.trim(),
      heroSubtitle: content.heroSubtitle.trim(),
      heroIntro: content.heroIntro.trim(),
      videoUrl: content.videoUrl.trim(),
      videoHelper: content.videoHelper.trim(),
      coachText: content.coachText.trim(),
      learnItems: content.learnItems
        .map((item) => item.trim())
        .filter(Boolean),
      testimonialsText: content.testimonialsText.trim(),
      testimonials: content.testimonials.map((testimonial) => ({
        name: testimonial.name.trim(),
        text: testimonial.text.trim(),
        type: testimonial.type.trim(),
        mediaKind: testimonial.mediaUrl ? testimonial.mediaKind : "none",
        mediaUrl: testimonial.mediaUrl.trim()
      })),
      prices: content.prices.map((price) => ({
        amount: price.amount.trim(),
        label: price.label.trim()
      })),
      whatsappUrl: content.whatsappUrl.trim(),
      whatsappText: content.whatsappText.trim()
    };

    try {
      const response = await fetchWithTimeout("/api/admin/reto-lily-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lily-admin-secret": secret
        },
        body: JSON.stringify({
          secret,
          locale,
          content: cleanContent
        })
      });

      const result = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.error || "No se pudo guardar la configuración.");
      }

      await reloadSettingsAfterSave();

      setStatus("success");
      setMessage("Cambios guardados correctamente. Abre o recarga la landing para verlos.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Lily admin save error:", error);
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la configuración."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleLogout() {
    window.localStorage.removeItem("lily_admin_secret");
    setSecret("");
    setStatus("idle");
    setMessage("");
  }

  if (!secret) {
    return (
      <main className="invisible-pattern-shell flex min-h-screen items-center justify-center px-6 py-24">
        <div className="luxury-noise" />

        <section className="relative z-10 mx-auto w-full max-w-xl">
          <div className="glass-panel pattern-card rounded-[2rem] border-champagne/35 p-8 text-center shadow-glow md:p-12">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-champagne">
              Panel privado
            </p>

            <h1 className="mt-5 font-serif text-5xl leading-tight text-linen md:text-6xl">
              Acceso Lily
            </h1>

            <p className="mt-5 text-base leading-7 text-muted">
              Introduce la clave privada para editar la landing del reto.
            </p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <input
                name="secret"
                type="password"
                placeholder="Clave privada"
                className="input-line w-full text-base"
                autoComplete="current-password"
              />

              <button
                type="submit"
                className="btn-glow w-full rounded bg-gold px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne"
              >
                Entrar al panel
              </button>
            </form>

            {message ? (
              <p className="mt-5 rounded-2xl border border-red-300/30 bg-red-500/5 px-5 py-4 text-sm text-red-200">
                {message}
              </p>
            ) : null}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="invisible-pattern-shell min-h-screen px-6 py-24">
      <div className="luxury-noise" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-champagne">
              Panel privado Lily
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-tight text-linen md:text-7xl">
              Editor del reto
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              Edita textos, vídeo, precios, WhatsApp y testimonios. No toca claves de Stripe, webhooks ni configuración sensible.
            </p>

            {updatedAt ? (
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted/70">
                Última actualización: {new Date(updatedAt).toLocaleString("es-ES")}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/es/reto-dinero"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-champagne/50 px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-champagne transition hover:bg-champagne hover:text-[#2f250d]"
            >
              Ver landing
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-muted transition hover:border-red-300/40 hover:text-red-200"
            >
              Salir
            </button>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-champagne/20 bg-champagne/5 p-5 text-sm leading-7 text-muted">
          <strong className="text-champagne">Importante:</strong> los 3 precios que guardes aquí serán los precios visibles en la landing y los precios validados para Stripe Checkout.
        </div>

        {message ? (
          <div
            className={`mb-8 rounded-2xl border px-6 py-5 text-sm ${
              status === "success" || status === "saving" || status === "loading"
                ? "border-champagne/30 bg-champagne/5 text-champagne"
                : "border-red-300/30 bg-red-500/5 text-red-200"
            }`}
          >
            {message}
          </div>
        ) : null}

        {status === "loading" ? (
          <div className="glass-panel rounded-[2rem] p-8 text-center text-muted">
            Cargando configuración...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8">
            <SectionCard
              title="Idioma"
              subtitle="Por ahora estamos trabajando principalmente la versión española. La inglesa queda preparada para futuro."
            >
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value as "es" | "en")}
                className="input-line w-full max-w-sm text-base"
              >
                <option value="es" className="bg-charcoal text-linen">
                  Español
                </option>
                <option value="en" className="bg-charcoal text-linen">
                  Inglés
                </option>
              </select>
            </SectionCard>

            <SectionCard
              title="Hero principal"
              subtitle="Primera pantalla de la landing."
            >
              <div className="grid gap-6">
                <div>
                  <FieldLabel title="Título principal" />
                  <textarea
                    value={content.heroTitle}
                    onChange={(event) => updateContent("heroTitle", event.target.value)}
                    className="input-line mt-3 min-h-28 w-full resize-y text-base"
                    maxLength={180}
                    required
                  />
                </div>

                <div>
                  <FieldLabel title="Subtítulo" />
                  <input
                    value={content.heroSubtitle}
                    onChange={(event) => updateContent("heroSubtitle", event.target.value)}
                    className="input-line mt-3 w-full text-base"
                    maxLength={180}
                    required
                  />
                </div>

                <div>
                  <FieldLabel title="Texto introductorio" />
                  <textarea
                    value={content.heroIntro}
                    onChange={(event) => updateContent("heroIntro", event.target.value)}
                    className="input-line mt-3 min-h-24 w-full resize-y text-base"
                    maxLength={240}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Vídeo principal"
              subtitle="Puedes pegar una URL externa o subir un vídeo directamente desde este panel."
            >
              <div className="grid gap-6">
                <div>
                  <FieldLabel
                    title="URL del vídeo"
                    helper="Si subes un vídeo desde este panel, esta URL se rellenará automáticamente."
                  />
                  <input
                    value={content.videoUrl}
                    onChange={(event) => updateContent("videoUrl", event.target.value)}
                    className="input-line mt-3 w-full text-base"
                    placeholder="https://..."
                    maxLength={500}
                  />
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <FieldLabel
                    title="Subir vídeo principal"
                    helper="Formatos permitidos: MP4, WEBM, MOV o M4V. Tamaño máximo: 500 MB. Si el navegador falla, sube el vídeo manualmente a Supabase Storage y pega aquí su URL pública."
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setSelectedVideoFile(file);
                      setVideoUploadStatus("idle");
                      setVideoUploadMessage("");
                    }}
                    className="mt-4 block w-full cursor-pointer rounded-2xl border border-champagne/20 bg-white/[0.03] px-4 py-4 text-sm text-muted file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-3 file:text-xs file:font-black file:uppercase file:tracking-[0.18em] file:text-[#3c2f00]"
                  />

                  {selectedVideoFile ? (
                    <div className="mt-4 rounded-2xl border border-champagne/20 bg-champagne/5 p-4 text-sm leading-6 text-muted">
                      <p>
                        <strong className="text-champagne">Archivo seleccionado:</strong>{" "}
                        {selectedVideoFile.name}
                      </p>
                      <p>
                        <strong className="text-champagne">Tamaño:</strong>{" "}
                        {formatFileSize(selectedVideoFile.size)}
                      </p>
                      <p>
                        <strong className="text-champagne">Formato:</strong>{" "}
                        {selectedVideoFile.type || "No detectado"}
                      </p>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handleVideoUpload}
                    disabled={!selectedVideoFile || videoUploadStatus === "uploading"}
                    className="mt-5 rounded border border-champagne/60 px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] text-champagne transition hover:bg-champagne hover:text-[#2f250d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {videoUploadStatus === "uploading" ? "Subiendo vídeo..." : "Subir vídeo"}
                  </button>

                  {videoUploadMessage ? (
                    <p
                      className={`mt-4 rounded-2xl border px-5 py-4 text-sm leading-6 ${
                        videoUploadStatus === "success"
                          ? "border-champagne/30 bg-champagne/5 text-champagne"
                          : videoUploadStatus === "error"
                            ? "border-red-300/30 bg-red-500/5 text-red-200"
                            : "border-white/10 bg-white/[0.03] text-muted"
                      }`}
                    >
                      {videoUploadMessage}
                    </p>
                  ) : null}
                </div>

                <div>
                  <FieldLabel title="Texto debajo del vídeo" />
                  <textarea
                    value={content.videoHelper}
                    onChange={(event) => updateContent("videoHelper", event.target.value)}
                    className="input-line mt-3 min-h-24 w-full resize-y text-base"
                    maxLength={260}
                    required
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Sección Lily Camarena">
              <div>
                <FieldLabel title="Texto de presentación" />
                <textarea
                  value={content.coachText}
                  onChange={(event) => updateContent("coachText", event.target.value)}
                  className="input-line mt-3 min-h-40 w-full resize-y text-base"
                  maxLength={900}
                  required
                />
              </div>
            </SectionCard>

            <SectionCard
              title="En estos 3 días vas a..."
              subtitle="Puedes usar entre 1 y 6 puntos. Los vacíos no se guardan."
            >
              <div className="grid gap-5">
                {content.learnItems.map((item, index) => (
                  <div key={`learn-${index}`}>
                    <FieldLabel title={`Punto ${index + 1}`} />
                    <textarea
                      value={item}
                      onChange={(event) => updateLearnItem(index, event.target.value)}
                      className="input-line mt-3 min-h-24 w-full resize-y text-base"
                      maxLength={320}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Historias reales">
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <input
                  id="showTestimonials"
                  type="checkbox"
                  checked={content.showTestimonials}
                  onChange={(event) => updateContent("showTestimonials", event.target.checked)}
                  className="accent-[#f2ca50]"
                />
                <label
                  htmlFor="showTestimonials"
                  className="text-sm leading-6 text-muted"
                >
                  Mostrar sección de testimonios en la landing
                </label>
              </div>

              <div className="mb-8">
                <FieldLabel title="Texto de introducción a testimonios" />
                <textarea
                  value={content.testimonialsText}
                  onChange={(event) => updateContent("testimonialsText", event.target.value)}
                  className="input-line mt-3 min-h-32 w-full resize-y text-base"
                  maxLength={700}
                  required
                />
              </div>

              <div className="grid gap-6">
                {content.testimonials.map((testimonial, index) => {
                  const selectedFile = selectedTestimonialFiles[index];
                  const uploadStatus = testimonialUploadStatus[index] || "idle";
                  const uploadMessage = testimonialUploadMessages[index] || "";

                  return (
                    <div
                      key={`testimonial-${index}`}
                      className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5"
                    >
                      <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-champagne">
                        Testimonio {index + 1}
                      </p>

                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <FieldLabel title="Nombre / Identificador" />
                          <input
                            value={testimonial.name}
                            onChange={(event) => updateTestimonial(index, "name", event.target.value)}
                            className="input-line mt-3 w-full text-base"
                            maxLength={120}
                            required
                          />
                        </div>

                        <div>
                          <FieldLabel title="Tipo visible" helper="Ejemplo: Imagen, Audio, Vídeo, Historia." />
                          <input
                            value={testimonial.type}
                            onChange={(event) => updateTestimonial(index, "type", event.target.value)}
                            className="input-line mt-3 w-full text-base"
                            maxLength={80}
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <FieldLabel title="Texto del testimonio" />
                        <textarea
                          value={testimonial.text}
                          onChange={(event) => updateTestimonial(index, "text", event.target.value)}
                          className="input-line mt-3 min-h-28 w-full resize-y text-base"
                          maxLength={900}
                          required
                        />
                      </div>

                      <div className="mt-5 grid gap-5 md:grid-cols-[0.7fr_1.3fr]">
                        <div>
                          <FieldLabel title="Formato" />
                          <select
                            value={testimonial.mediaKind}
                            onChange={(event) =>
                              updateTestimonial(index, "mediaKind", event.target.value as TestimonialMediaKind)
                            }
                            className="input-line mt-3 w-full text-base"
                          >
                            <option value="none" className="bg-charcoal text-linen">
                              Solo texto
                            </option>
                            <option value="image" className="bg-charcoal text-linen">
                              Imagen
                            </option>
                            <option value="video" className="bg-charcoal text-linen">
                              Vídeo
                            </option>
                            <option value="audio" className="bg-charcoal text-linen">
                              Audio
                            </option>
                          </select>
                        </div>

                        <div>
                          <FieldLabel title="URL del archivo" helper="Se rellena automáticamente al subir archivo, o puedes pegar una URL externa." />
                          <input
                            value={testimonial.mediaUrl}
                            onChange={(event) => updateTestimonial(index, "mediaUrl", event.target.value)}
                            className="input-line mt-3 w-full text-base"
                            maxLength={700}
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      {testimonial.mediaUrl ? (
                        <div className="mt-5 rounded-2xl border border-champagne/20 bg-champagne/5 p-4">
                          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-champagne">
                              Vista previa
                            </p>

                            <button
                              type="button"
                              onClick={() => clearTestimonialMedia(index)}
                              className="rounded border border-red-300/45 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-200 transition hover:bg-red-400/10"
                            >
                              Quitar archivo
                            </button>
                          </div>

                          {testimonial.mediaKind === "image" ? (
                            <img
                              src={testimonial.mediaUrl}
                              alt={testimonial.name}
                              className="mx-auto max-h-[460px] w-full rounded-2xl object-contain"
                            />
                          ) : testimonial.mediaKind === "video" ? (
                            <video
                              src={testimonial.mediaUrl}
                              controls
                              playsInline
                              className="w-full rounded-2xl bg-black"
                            />
                          ) : testimonial.mediaKind === "audio" ? (
                            <audio
                              src={testimonial.mediaUrl}
                              controls
                              className="w-full"
                            />
                          ) : (
                            <p className="text-sm text-muted">
                              Archivo guardado como solo texto. Cambia el formato si quieres mostrarlo.
                            </p>
                          )}
                        </div>
                      ) : null}

                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                        <FieldLabel
                          title="Subir archivo para este testimonio"
                          helper="Imagen JPG/PNG/WEBP, vídeo MP4/WEBM/MOV/M4V o audio MP3/M4A/WAV/WEBM. Máximo 200 MB."
                        />

                        <input
                          ref={(element) => {
                            testimonialFileInputRefs.current[index] = element;
                          }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,video/x-m4v,audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/x-wav"
                          onChange={(event) => {
                            const file = event.target.files?.[0] || null;
                            setSelectedTestimonialFiles((current) => ({
                              ...current,
                              [index]: file
                            }));
                            setTestimonialUploadStatus((current) => ({
                              ...current,
                              [index]: "idle"
                            }));
                            setTestimonialUploadMessages((current) => ({
                              ...current,
                              [index]: ""
                            }));
                          }}
                          className="mt-4 block w-full cursor-pointer rounded-2xl border border-champagne/20 bg-white/[0.03] px-4 py-4 text-sm text-muted file:mr-4 file:rounded file:border-0 file:bg-gold file:px-4 file:py-3 file:text-xs file:font-black file:uppercase file:tracking-[0.18em] file:text-[#3c2f00]"
                        />

                        {selectedFile ? (
                          <div className="mt-4 rounded-2xl border border-champagne/20 bg-champagne/5 p-4 text-sm leading-6 text-muted">
                            <p>
                              <strong className="text-champagne">Archivo seleccionado:</strong>{" "}
                              {selectedFile.name}
                            </p>
                            <p>
                              <strong className="text-champagne">Tamaño:</strong>{" "}
                              {formatFileSize(selectedFile.size)}
                            </p>
                            <p>
                              <strong className="text-champagne">Formato:</strong>{" "}
                              {selectedFile.type || "No detectado"}
                            </p>
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleTestimonialUpload(index)}
                          disabled={!selectedFile || uploadStatus === "uploading"}
                          className="mt-5 rounded border border-champagne/60 px-6 py-4 text-xs font-bold uppercase tracking-[0.22em] text-champagne transition hover:bg-champagne hover:text-[#2f250d] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {uploadStatus === "uploading" ? "Subiendo archivo..." : "Subir archivo"}
                        </button>

                        {uploadMessage ? (
                          <p
                            className={`mt-4 rounded-2xl border px-5 py-4 text-sm leading-6 ${
                              uploadStatus === "success"
                                ? "border-champagne/30 bg-champagne/5 text-champagne"
                                : uploadStatus === "error"
                                  ? "border-red-300/30 bg-red-500/5 text-red-200"
                                  : "border-white/10 bg-white/[0.03] text-muted"
                            }`}
                          >
                            {uploadMessage}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="Precios"
              subtitle="Solo se muestran 3 opciones en la landing. La moneda de Stripe sigue fija en USD. Usa formato $7, $27 y $47."
            >
              <div className="grid gap-5 md:grid-cols-3">
                {content.prices.map((price, index) => (
                  <div
                    key={`price-${index}`}
                    className={`rounded-2xl border p-5 ${
                      index === 1
                        ? "border-champagne/40 bg-champagne/10 shadow-glow"
                        : "border-white/10 bg-black/20"
                    }`}
                  >
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-champagne">
                      {index === 1 ? "Opción recomendada" : `Opción ${index + 1}`}
                    </p>

                    <div className="grid gap-4">
                      <div>
                        <FieldLabel title="Importe" />
                        <input
                          value={price.amount}
                          onChange={(event) => updatePrice(index, "amount", event.target.value)}
                          className="input-line mt-3 w-full text-base"
                          maxLength={12}
                          required
                        />
                      </div>

                      <div>
                        <FieldLabel title="Etiqueta" />
                        <input
                          value={price.label}
                          onChange={(event) => updatePrice(index, "label", event.target.value)}
                          className="input-line mt-3 w-full text-base"
                          maxLength={80}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="WhatsApp">
              <div className="grid gap-6">
                <div>
                  <FieldLabel title="URL de WhatsApp" />
                  <input
                    value={content.whatsappUrl}
                    onChange={(event) => updateContent("whatsappUrl", event.target.value)}
                    className="input-line mt-3 w-full text-base"
                    placeholder="https://wa.me/34686638097"
                    maxLength={180}
                    required
                  />
                </div>

                <div>
                  <FieldLabel title="Texto de WhatsApp" />
                  <textarea
                    value={content.whatsappText}
                    onChange={(event) => updateContent("whatsappText", event.target.value)}
                    className="input-line mt-3 min-h-24 w-full resize-y text-base"
                    maxLength={260}
                    required
                  />
                </div>
              </div>
            </SectionCard>

            <div className="sticky bottom-5 z-20 rounded-[2rem] border border-champagne/30 bg-surface/85 p-4 shadow-glow backdrop-blur-2xl">
              <div className="mb-3 text-center text-xs uppercase tracking-[0.18em] text-muted">
                {status === "saving"
                  ? "Guardando cambios..."
                  : status === "success"
                    ? "Últimos cambios guardados"
                    : "Revisa y guarda antes de salir"}
              </div>

              <button
                type="submit"
                disabled={status === "saving"}
                className="btn-glow w-full rounded bg-gold px-8 py-5 text-xs font-black uppercase tracking-[0.24em] text-[#3c2f00] transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "saving" ? "Guardando cambios..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

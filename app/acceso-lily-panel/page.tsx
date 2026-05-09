"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type PriceOption = {
  amount: string;
  label: string;
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

type VideoUploadResponse = {
  ok: boolean;
  error?: string;
  bucket?: string;
  path?: string;
  token?: string;
  signedUrl?: string;
  publicUrl?: string;
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
  prices: [
    { amount: "7$", label: "Compromiso inicial" },
    { amount: "17$", label: "Compromiso medio" },
    { amount: "27$", label: "Compromiso profundo" },
    { amount: "47$", label: "Compromiso total" }
  ],
  whatsappUrl: "https://wa.me/34686638097",
  whatsappText: "",
  showTestimonials: true
};

const MAX_VIDEO_SIZE_BYTES = 524288000;

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v"
];

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
    prices:
      Array.isArray(content?.prices) && content.prices.length > 0
        ? [...content.prices, ...EMPTY_CONTENT.prices].slice(0, 4)
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

  const [secret, setSecret] = useState("");
  const [locale, setLocale] = useState<"es" | "en">("es");
  const [content, setContent] = useState<PanelContent>(EMPTY_CONTENT);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoUploadStatus, setVideoUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [videoUploadMessage, setVideoUploadMessage] = useState("");

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

      const prepareResult = (await prepareResponse.json().catch(() => null)) as VideoUploadResponse | null;

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
              Edita textos, vídeo, precios visibles, WhatsApp y testimonios. No toca claves de Stripe, webhooks ni configuración sensible.
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
          <strong className="text-champagne">Importante:</strong> los precios que guardes aquí serán los precios visibles en la landing y los precios validados para Stripe Checkout.
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
              title="Vídeo"
              subtitle="Puedes pegar una URL externa o subir un vídeo directamente desde este panel."
            >
              <div className="grid gap-6">
                <div>
                  <FieldLabel
                    title="URL del vídeo"
                    helper="Si subes un vídeo desde este panel, esta URL se rellenará automáticamente. También puedes pegar aquí una URL externa de YouTube no listado, Vimeo, Bunny, etc."
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
                    title="Subir vídeo"
                    helper="Formatos permitidos: MP4, WEBM, MOV o M4V. Tamaño máximo: 500 MB."
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

              <div>
                <FieldLabel title="Texto de introducción a testimonios" />
                <textarea
                  value={content.testimonialsText}
                  onChange={(event) => updateContent("testimonialsText", event.target.value)}
                  className="input-line mt-3 min-h-32 w-full resize-y text-base"
                  maxLength={700}
                  required
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Precios"
              subtitle="Puedes cambiar importes y etiquetas. La moneda de Stripe sigue fija en USD."
            >
              <div className="grid gap-5 md:grid-cols-2">
                {content.prices.map((price, index) => (
                  <div
                    key={`price-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 p-5"
                  >
                    <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-champagne">
                      Opción {index + 1}
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

---
name: Obsidian & Gold Luxe
colors:
  surface: '#16130b'
  surface-dim: '#16130b'
  surface-bright: '#3d392f'
  surface-container-lowest: '#110e07'
  surface-container-low: '#1f1b13'
  surface-container: '#231f17'
  surface-container-high: '#2d2a21'
  surface-container-highest: '#38342b'
  on-surface: '#eae1d4'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#eae1d4'
  inverse-on-surface: '#343027'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#e4bfaf'
  on-secondary: '#422b20'
  secondary-container: '#5e4337'
  on-secondary-container: '#d5b1a1'
  tertiary: '#cfd0b8'
  on-tertiary: '#303221'
  tertiary-container: '#b4b49d'
  on-tertiary-container: '#454634'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#e4bfaf'
  on-secondary-fixed: '#2b160d'
  on-secondary-fixed-variant: '#5b4135'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b0'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474836'
  background: '#16130b'
  on-background: '#eae1d4'
  surface-variant: '#38342b'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  section-padding: 120px
  element-gap: 32px
---

## Brand & Style

The design system is centered on a "Cinematic Intimacy" aesthetic, tailored for a high-end money mindset challenge. It avoids the cold, clinical nature of traditional finance apps in favor of a moody, editorial atmosphere that evokes emotional safety and prestige. 

The style utilizes a refined **Glassmorphism** approach. Layers of semi-transparent charcoal are stacked over deep obsidian depths to create a sense of infinite space, while "light leaks" of champagne and rose gold provide warmth. The movement between states is fluid and slow, mirroring the intentionality of a luxury brand. This is a digital sanctuary for transformation, prioritizing quiet confidence over loud calls-to-action.

## Colors

The palette is anchored in a dark-mode-only environment to maintain its cinematic quality.

- **Primary (Champagne Gold):** Used sparingly for high-impact moments, success states, and primary CTAs. It represents the "gold standard" of the user's financial future.
- **Secondary (Soft Rose Gold):** Used for interactive elements, highlights, and emotional resonance. It softens the "hard" edges of money talk.
- **Tertiary (Warm Beige):** A grounding neutral used for secondary text and subtle borders to prevent the UI from feeling too harsh or monochromatic.
- **Backgrounds:** A base of Deep Obsidian (#0A0A0A) provides the canvas, while Charcoal (#1A1A1A) creates layered surfaces and containers.

## Typography

The typography strategy balances the poetic with the practical.

- **Headlines:** Use **Noto Serif** for its timeless, editorial elegance. Large display sizes should utilize tighter letter spacing to feel "locked" and grounded.
- **Body & UI:** Use **Manrope** for its clean, modern geometric profile. It provides a sophisticated counterpoint to the serif, ensuring financial data and instructions remain highly legible.
- **Hierarchy:** Use the `label-caps` style for small headers or eyebrows to inject a high-fashion, rhythmic quality into the layout.

## Layout & Spacing

This design system employs a **Fixed Grid** with generous, "excessive" whitespace to signal luxury. 

- **The Breath:** Sections should have a minimum vertical padding of 120px to let the content breathe. 
- **Grid:** A 12-column grid is used for desktop, but elements frequently span the center 6 or 8 columns to create a focused, intimate reading experience.
- **Transitions:** Layout shifts should be handled via CSS fades and soft vertical slides (20px travel) to maintain the cinematic feel.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Subtle Glassmorphism** rather than traditional dropshadows.

- **Surface 0:** Deep Obsidian background.
- **Surface 1:** Charcoal container with a 40% opacity and a 20px backdrop blur.
- **Borders:** No solid hex-code borders. Instead, use "inner glows" or 1px strokes with a linear gradient of `White (10%)` to `White (0%)` to simulate a glass edge.
- **Gradients:** Use soft radial gradients in the background (Champagne at 5% opacity) to create "pools of light" behind key cards or focal points.

## Shapes

The shape language is "Softly Architectural."

- **Containers:** We use a subtle 4px to 8px radius (`rounded-lg`). It is enough to feel modern and feminine without becoming "bubbly" or informal.
- **Buttons:** Rectangular with a very slight corner radius (4px) to maintain a sense of high-end structure.
- **Imagery:** Photography should utilize soft, feathered edges or be contained within the same `rounded-lg` containers to maintain system unity.

## Components

- **Primary Buttons:** Solid Champagne Gold with black text. On hover, a soft glow (box-shadow: 0 0 20px #D4AF3744) appears.
- **Ghost Buttons:** 1px Rose Gold border with Champagne Gold text. No background fill unless hovered.
- **Cards:** Glassmorphic panels with a 1px top-left highlight and a 1px bottom-right lowlight to simulate a physical pane of glass.
- **Inputs:** Simple bottom-border only (Warm Beige) to mimic elegant stationery. The label floats above in `label-caps` style when active.
- **Progress Indicators:** Use a thin, elegant line (1px height). The progress bar itself should be a Rose Gold to Champagne Gold gradient.
- **Mindset Journal Cards:** Special oversized cards with Noto Serif typography and extra-generous internal padding (48px) for emotional reflection tasks.
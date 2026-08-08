import { Portal } from "@portalsdk/core";

/** El cliente vive en el módulo, no dentro de un componente: así sobrevive a los renders. */
export const portal = new Portal({
  apiKey: process.env.NEXT_PUBLIC_PORTAL_KEY!,
});

export const CANAL_CAPILLA = "capilla";

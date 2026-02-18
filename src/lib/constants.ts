export const COMPANY_NAME = "Stadtreinigung Weber GmbH";
export const APP_VERSION = "1.0.1";

export const CATEGORY_LABELS: Record<string, string> = {
  tonnenbereitstellung: "Tonnenbereitstellung",
  abholung_verpasst: "Abholung verpasst",
  sperrmuell: "Sperrmüll",
  rechnung: "Rechnung",
  tonnentausch: "Tonnentausch",
  adressaenderung: "Adressänderung",
  beschwerde: "Beschwerde",
  allgemein: "Allgemein",
};

export const STATUS_LABELS: Record<string, string> = {
  open: "Offen",
  in_progress: "In Bearbeitung",
  resolved: "Gelöst",
  closed: "Geschlossen",
};

export const PRIORITY_LABELS: Record<string, string> = {
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

export const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400",
  in_progress: "bg-orange-500/10 text-orange-700 ring-1 ring-orange-500/20 dark:bg-orange-500/15 dark:text-orange-400",
  resolved: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400",
  closed: "bg-zinc-500/10 text-zinc-600 ring-1 ring-zinc-500/20 dark:bg-zinc-500/15 dark:text-zinc-400",
};

export const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-500/10 text-red-700 ring-1 ring-red-500/20 dark:bg-red-500/15 dark:text-red-400",
  medium: "bg-yellow-500/10 text-yellow-700 ring-1 ring-yellow-500/20 dark:bg-yellow-500/15 dark:text-yellow-400",
  low: "bg-zinc-500/10 text-zinc-600 ring-1 ring-zinc-500/20 dark:bg-zinc-500/15 dark:text-zinc-400",
};

export const CATEGORY_COLORS: Record<string, string> = {
  tonnenbereitstellung: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400",
  abholung_verpasst: "bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400",
  sperrmuell: "bg-purple-500/10 text-purple-700 ring-1 ring-purple-500/20 dark:bg-purple-500/15 dark:text-purple-400",
  rechnung: "bg-cyan-500/10 text-cyan-700 ring-1 ring-cyan-500/20 dark:bg-cyan-500/15 dark:text-cyan-400",
  tonnentausch: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400",
  adressaenderung: "bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-400",
  beschwerde: "bg-red-500/10 text-red-700 ring-1 ring-red-500/20 dark:bg-red-500/15 dark:text-red-400",
  allgemein: "bg-zinc-500/10 text-zinc-600 ring-1 ring-zinc-500/20 dark:bg-zinc-500/15 dark:text-zinc-400",
};

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  restmuell: "Restmüll",
  biomuell: "Biomüll",
  papier: "Papier",
  gelber_sack: "Gelber Sack",
  sperrmuell: "Sperrmüll",
};

export const PICKUP_FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Wöchentlich",
  biweekly: "14-tägig",
  monthly: "Monatlich",
};

export const AI_LABELS = {
  paneTitle: "KI-Assistent",
  contextHeading: "Kontext",
  generateButton: "Antwort vorschlagen",
  regenerateButton: "Neu generieren",
  useSuggestionButton: "Vorschlag verwenden",
  suggestionHeading: "Vorgeschlagene Antwort",
  triggerButton: "KI-Vorschlag",
  additionalInstructionsLabel: "Zusatzhinweise (optional)",
  additionalInstructionsPlaceholder: "z.B. 'Abholung wird auf Freitag verschoben'",
  tabCustomer: "Kundeninfo",
  tabAi: "KI-Assistent",
  sidebarToggle: "KI-Assistent öffnen",
  sidebarCollapse: "Schließen",
};

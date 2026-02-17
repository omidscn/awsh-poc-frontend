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
  open: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
  in_progress: "bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20",
  resolved: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
  closed: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/20",
};

export const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
  medium: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20",
  low: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/20",
};

export const CATEGORY_COLORS: Record<string, string> = {
  tonnenbereitstellung: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
  abholung_verpasst: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/20",
  sperrmuell: "bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/20",
  rechnung: "bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/20",
  tonnentausch: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",
  adressaenderung: "bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/20",
  beschwerde: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
  allgemein: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/20",
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

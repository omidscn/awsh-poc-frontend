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
  open: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  in_progress: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  closed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-50 text-red-700 ring-1 ring-red-200",
  medium: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
  low: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

export const CATEGORY_COLORS: Record<string, string> = {
  tonnenbereitstellung: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  abholung_verpasst: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  sperrmuell: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  rechnung: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
  tonnentausch: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  adressaenderung: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  beschwerde: "bg-red-50 text-red-700 ring-1 ring-red-200",
  allgemein: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
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

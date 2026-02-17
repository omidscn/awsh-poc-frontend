export const COMPANY_NAME = "Stadtreinigung Weber GmbH";

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
  open: "bg-blue-100 text-blue-800",
  in_progress: "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

export const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-600",
};

export const CATEGORY_COLORS: Record<string, string> = {
  tonnenbereitstellung: "bg-emerald-100 text-emerald-800",
  abholung_verpasst: "bg-rose-100 text-rose-800",
  sperrmuell: "bg-purple-100 text-purple-800",
  rechnung: "bg-cyan-100 text-cyan-800",
  tonnentausch: "bg-amber-100 text-amber-800",
  adressaenderung: "bg-indigo-100 text-indigo-800",
  beschwerde: "bg-red-100 text-red-800",
  allgemein: "bg-gray-100 text-gray-700",
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
};

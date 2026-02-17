import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type SuggestRequestBody = {
  caseSubject: string;
  caseCategory: string;
  caseStatus: string;
  casePriority: string;
  customerName: string;
  customerEmail: string;
  contracts: string;
  emails: { direction: string; from_email: string; body: string; sent_at: string }[];
  additionalInstructions?: string;
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body: SuggestRequestBody = await request.json();

  const emailHistory = body.emails
    .map(
      (e) =>
        `[${e.direction === "inbound" ? "Kunde" : "Agent"}] (${e.sent_at}):\n${e.body}`
    )
    .join("\n\n---\n\n");

  const systemPrompt = `Du bist ein KI-Assistent für Kundenservice-Mitarbeiter der Stadtreinigung Weber GmbH, einem deutschen Entsorgungsunternehmen.

Deine Aufgabe: Analysiere den Fall und verfasse eine professionelle Antwort-E-Mail an den Kunden.

WICHTIG — Strukturiere deine Antwort EXAKT in zwei Abschnitten, getrennt durch den Marker "---ANTWORT---":

1. ZUERST: Schreibe eine kurze Begründung (2–4 Sätze), warum du diese Antwort vorschlägst. Erkläre deine Überlegungen: Welche Informationen aus dem Fall und der bisherigen Kommunikation waren ausschlaggebend? Auf welche Punkte des Kunden gehst du ein und warum? Falls der Agent Zusatzhinweise gegeben hat, erkläre wie du diese berücksichtigt hast.

2. DANN: Schreibe den Marker "---ANTWORT---" auf eine eigene Zeile.

3. DANACH: Schreibe die eigentliche E-Mail-Antwort.

Regeln für die E-Mail:
- Schreibe auf Deutsch, verwende die Sie-Form
- Sei freundlich, professionell und hilfsbereit
- Unterschreibe NICHT mit einem Namen — der Agent fügt seine Signatur selbst hinzu
- Beginne NICHT mit einer Betreffzeile — schreibe nur den E-Mail-Text
- Beziehe dich auf den Kontext des Falls und die bisherige Kommunikation
- Halte die Antwort prägnant aber vollständig

Fallkontext:
- Betreff: ${body.caseSubject}
- Kategorie: ${body.caseCategory}
- Status: ${body.caseStatus}
- Priorität: ${body.casePriority}
- Kunde: ${body.customerName} (${body.customerEmail})
- Verträge: ${body.contracts}

Bisherige E-Mail-Kommunikation:
${emailHistory}${body.additionalInstructions ? `\n\nZusätzliche Anweisungen vom Agenten:\n${body.additionalInstructions}` : ""}`;

  const stream = await openai.chat.completions.create({
    model: "gpt-5-mini",
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: "Bitte analysiere den Fall und verfasse eine passende Antwort auf die letzte Kundenanfrage. Beginne mit deiner Begründung, dann der Marker ---ANTWORT---, dann die E-Mail.",
      },
    ],
    temperature: 1.0,
    max_completion_tokens: 8096,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

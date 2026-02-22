import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { getTemplateById, getTemplatesForCategory } from "@/lib/textbausteine";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type EvaluateRequestBody = {
  caseSubject: string;
  caseCategory: string;
  caseStatus: string;
  casePriority: string;
  customerName: string;
  customerEmail: string;
  contracts: string;
  emails: { direction: string; from_email: string; body: string; sent_at: string }[];
  selectedTemplateIds?: string[];
  messages: { role: "user" | "assistant"; content: string }[];
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body: EvaluateRequestBody = await request.json();

  const emailHistory = body.emails
    .map(
      (e) =>
        `[${e.direction === "inbound" ? "Kunde" : "Agent"}] (${e.sent_at}):\n${e.body}`
    )
    .join("\n\n---\n\n");

  const templates =
    body.selectedTemplateIds && body.selectedTemplateIds.length > 0
      ? body.selectedTemplateIds
          .map((id) => getTemplateById(id))
          .filter(Boolean) as NonNullable<ReturnType<typeof getTemplateById>>[]
      : getTemplatesForCategory(body.caseCategory);

  const templatesSection =
    templates.length > 0
      ? `\n\nVerfügbare Textbausteine:\n${templates
          .map((t, i) => `--- Textbaustein ${i + 1}: ${t.title} ---\n${t.content}`)
          .join("\n\n")}`
      : "";

  const systemPrompt = `Du bist ein KI-Assistent für Kundenservice-Mitarbeiter der Stadtreinigung Weber GmbH, einem deutschen Entsorgungsunternehmen.

Du befindest dich im Evaluierungsmodus. Der Kundenservice-Agent möchte testen, wie gut du den Fallkontext verstehst und wie du an diesen Fall herangehst — bevor du eine Antwort generierst.

Antworte auf Deutsch, klar und reflektiert:
- Erkläre dein Verständnis der Kundensituation, wenn du danach gefragt wirst
- Begründe, welchen Textbaustein du als Grundlage wählen würdest und warum
- Sei transparent über deine Überlegungen und mögliche Unsicherheiten
- Gehe auf konkrete Details aus den E-Mails und Kundendaten ein
- Wenn du etwas nicht sicher weißt, sag es ehrlich

Fallkontext:
- Betreff: ${body.caseSubject}
- Kategorie: ${body.caseCategory}
- Status: ${body.caseStatus}
- Priorität: ${body.casePriority}
- Kunde: ${body.customerName} (${body.customerEmail})
- Verträge: ${body.contracts}

Bisherige E-Mail-Kommunikation:
${emailHistory}${templatesSection}`;

  let stream;
  try {
    stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...body.messages,
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });
  } catch (err) {
    console.error("[/api/ai/evaluate] OpenAI error:", err);
    return new Response(
      JSON.stringify({ error: "OpenAI request failed", detail: String(err) }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } catch (err) {
        console.error("[/api/ai/evaluate] Stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

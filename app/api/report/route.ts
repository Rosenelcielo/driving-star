import { NextResponse } from "next/server";

type ReportRequest = {
  resultId: string;
  aiInput: {
    planetTitle: string;
    primaryLabel: string;
    secondaryLabel: string;
    topDimensions: string[];
    cardsPlayed: string[];
    journeySummary: string[];
  };
  planet: {
    name: string;
    title: string;
    colorAdvice: string;
  };
  dimensions: Record<string, number>;
};

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        reason: "missing_api_key",
      },
      { status: 503 },
    );
  }

  const body = (await request.json()) as ReportRequest;
  const model = process.env.OPENAI_REPORT_MODEL ?? "gpt-4.1-mini";

  const prompt = [
    "You are the narrative assistant for the Driver Star interactive web game.",
    "Write the result in natural Simplified Chinese.",
    "Keep the original personality labels and recommendation direction unchanged.",
    "Return strict JSON with keys: userViewNarrative, salesViewNarrative, toneWarnings.",
    `Planet: ${body.planet.name} / ${body.planet.title} / Color advice: ${body.planet.colorAdvice}`,
    `Primary label: ${body.aiInput.primaryLabel}`,
    `Secondary label: ${body.aiInput.secondaryLabel}`,
    `Top dimensions: ${body.aiInput.topDimensions.join(", ")}`,
    `Cards played: ${body.aiInput.cardsPlayed.join(", ")}`,
    `Journey summary: ${body.aiInput.journeySummary.join(" | ")}`,
    `Dimension scores: ${Object.entries(body.dimensions)
      .map(([key, value]) => `${key}:${value}`)
      .join(", ")}`,
    "Requirements:",
    "1. userViewNarrative: second-person voice, natural personality-test style, 80-140 Chinese characters.",
    "2. salesViewNarrative: sales consultant perspective, summarize needs and recommendation angle, 80-140 Chinese characters.",
    "3. toneWarnings: an array of strings, may be empty.",
  ].join("\n");

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "driver_star_report",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                userViewNarrative: {
                  type: "string",
                },
                salesViewNarrative: {
                  type: "string",
                },
                toneWarnings: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["userViewNarrative", "salesViewNarrative", "toneWarnings"],
            },
          },
        },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          ok: false,
          reason: "openai_error",
          detail: errorText,
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as {
      output_text?: string;
    };

    if (!data.output_text) {
      return NextResponse.json(
        {
          ok: false,
          reason: "empty_output",
        },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(data.output_text) as {
      userViewNarrative: string;
      salesViewNarrative: string;
      toneWarnings?: string[];
    };

    return NextResponse.json({
      ok: true,
      resultId: body.resultId,
      aiNarrative: {
        userViewNarrative: parsed.userViewNarrative,
        salesViewNarrative: parsed.salesViewNarrative,
        toneWarnings: parsed.toneWarnings ?? [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        reason: "request_failed",
        detail: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}



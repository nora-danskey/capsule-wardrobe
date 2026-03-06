import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";


const VIBE_OPTIONS = [
  "minimalist", "classic", "bohemian", "edgy",
  "romantic", "sporty", "business", "eclectic", "default",
];

const OCCASION_OPTIONS = [
  "Work / Office", "Weekend Casual", "Evening & Events",
  "Travel", "Active / Outdoor", "Date Nights",
];

export async function POST(request: NextRequest) {
  try {
    return await handlePost(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[analyze] unhandled error:", message);
    console.error("[analyze] stack:", stack);
    return NextResponse.json({ error: message, stack }, { status: 500 });
  }
}

async function handlePost(request: NextRequest) {
  // Check API key before doing anything else
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[analyze] ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  // Parse request body
  let images: { base64: string; mediaType: string }[];
  try {
    const body = await request.json();
    images = body.images;
    console.log(`[analyze] received ${images?.length ?? 0} image(s)`);
  } catch (err) {
    console.error("[analyze] failed to parse request body:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    return NextResponse.json({ error: "No images provided" }, { status: 400 });
  }

  // Call Anthropic
  let rawText: string;
  try {
    const client = new Anthropic({ apiKey });

    const imageContent = images.map((img) => ({
      type: "image" as const,
      source: {
        type: "base64" as const,
        media_type: img.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: img.base64,
      },
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: `Analyze these wardrobe or outfit photos and return a JSON object with exactly these fields:

- vibe: one of exactly these values: ${VIBE_OPTIONS.join(", ")}
- colorPalette: array of exactly 4 hex color strings representing the dominant colors in these outfits (e.g. ["#F5F0E8", "#C8B8A2", "#7D6B5E", "#2C2420"])
- occasions: array of occasions this wardrobe suits, choosing only from: ${OCCASION_OPTIONS.join(", ")}
- keywords: array of 3-5 concise style keywords (e.g. "relaxed", "structured", "earthy", "monochrome")
- insights: one sentence of personalized style observation about the wardrobe shown

Return ONLY the raw JSON object — no markdown, no code fences, no explanation.`,
            },
          ],
        },
      ],
    });

    rawText = response.content[0].type === "text" ? response.content[0].text : "";
    console.log("[analyze] Anthropic response:", rawText.slice(0, 200));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[analyze] Anthropic API error:", err);
    return NextResponse.json({ error: `Anthropic API error: ${message}` }, { status: 500 });
  }

  // Parse JSON response
  try {
    const analysis = JSON.parse(rawText);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[analyze] JSON parse error. Raw text was:", rawText);
    return NextResponse.json(
      { error: `Model returned non-JSON response: ${rawText.slice(0, 300)}` },
      { status: 500 },
    );
  }
}

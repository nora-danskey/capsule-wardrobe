import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

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
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const imageContent = images.map((img: { base64: string; mediaType: string }) => ({
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

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const analysis = JSON.parse(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

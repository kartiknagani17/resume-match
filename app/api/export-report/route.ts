import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alignmentScore, explanation, keywords } = body as {
      alignmentScore: number;
      explanation: string;
      keywords: Array<{ keyword: string; tip: string }>;
    };

    const filename = `alignment-report-${Date.now()}.txt`;

    const lines = [
      "Resume vs Job — Alignment Report",
      "==================================",
      "",
      `Alignment score: ${alignmentScore}%`,
      "",
      "Summary",
      "--------",
      explanation,
      "",
      "Suggested keywords to add",
      "-------------------------",
      ...keywords.map((k) => `• ${k.keyword}: ${k.tip}`),
    ];
    const content = lines.join("\n");

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("export-report error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Export failed" },
      { status: 500 }
    );
  }
}

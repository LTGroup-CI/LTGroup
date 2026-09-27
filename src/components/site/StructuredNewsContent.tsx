import React from "react";

function isHeading(text: string) {
  return text.length <= 80 && !/[.!?]$/.test(text) && !text.startsWith("•") && !text.includes(":");
}

export function StructuredNewsContent({ content }: { content: string | null }) {
  if (!content?.trim()) return null;
  const blocks = content
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="space-y-7">
      {blocks.map((block, index) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const bullets = lines.filter((line) => /^•\s*/.test(line));
        const nonBullets = lines.filter((line) => !/^•\s*/.test(line));
        const normalized = block.replace(/\s+/g, " ").trim();

        if (bullets.length >= 2 && nonBullets.length === 0) {
          return (
            <div key={index} className="grid gap-3 sm:grid-cols-2">
              {bullets.map((line) => (
                <div key={line} className="rounded-xl border border-border bg-card px-5 py-4 text-[0.98rem] leading-7 text-foreground/80">
                  {line.replace(/^•\s*/, "")}
                </div>
              ))}
            </div>
          );
        }

        if (/^(informations|contact|informations et visites|pour en savoir plus)\b/i.test(normalized)) {
          return (
            <div key={index} className="rounded-2xl border border-gold/30 bg-accent/40 p-6">
              <p className="text-sm font-semibold text-foreground">{normalized}</p>
            </div>
          );
        }

        if (isHeading(normalized)) {
          return <h2 key={index} className="pt-2 text-2xl font-semibold tracking-tight text-foreground">{normalized}</h2>;
        }

        return (
          <p key={index} className="text-[1.02rem] leading-8 text-foreground/80 [text-align:justify]">
            {block}
          </p>
        );
      })}
    </div>
  );
}

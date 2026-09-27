import React from "react";

const emojiPattern = /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u20E3]/gu;

function cleanText(value: string) {
  return value
    .replace(emojiPattern, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function isInfoHeading(text: string) {
  return /^(informations(?: pratiques)?|contact(?:s)?|informations et visites|pour en savoir plus|coordonnées)\b/i.test(text);
}

export function StructuredNewsContent({
  content,
  title,
}: {
  content: string | null;
  title?: string | null;
}) {
  if (!content?.trim()) return null;

  const cleanTitle = cleanText(title ?? "").replace(/^#+\s*/, "").toLowerCase();
  const blocks = cleanText(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => cleanText(block).replace(/^#+\s*/, "").toLowerCase() !== cleanTitle);

  let paragraphIndex = 0;

  return (
    <div className="w-full space-y-8">
      {blocks.map((block, index) => {
        const lines = block
          .split("\n")
          .map((line) => cleanText(line))
          .filter(Boolean);

        const explicitHeading = lines.length === 1 && /^##\s+/.test(lines[0] ?? "");
        const heading = explicitHeading ? (lines[0] ?? "").replace(/^##\s+/, "").trim() : "";
        const bullets = lines.filter((line) => /^•\s*/.test(line));
        const nonBullets = lines.filter((line) => !/^•\s*/.test(line));
        const normalized = lines.join(" ").replace(/\s+/g, " ").trim();

        if (explicitHeading) {
          const info = isInfoHeading(heading);

          return (
            <div
              key={"heading-" + index}
              className={
                info
                  ? "rounded-2xl border border-border bg-accent/40 px-6 py-5"
                  : "border-l-2 border-gold pl-5"
              }
            >
              <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {heading}
              </h2>
            </div>
          );
        }

        if (bullets.length >= 2 && nonBullets.length === 0) {
          return (
            <div key={"facts-" + index} className="grid gap-3 sm:grid-cols-2">
              {bullets.map((line, bulletIndex) => (
                <div
                  key={"fact-" + index + "-" + bulletIndex}
                  className="rounded-xl border border-border bg-card px-5 py-4 text-[0.98rem] leading-7 text-foreground/80"
                >
                  {line.replace(/^•\s*/, "")}
                </div>
              ))}
            </div>
          );
        }

        if (isInfoHeading(normalized)) {
          return (
            <div key={"info-" + index} className="rounded-2xl border border-border bg-accent/40 px-6 py-5">
              <p className="text-[0.98rem] leading-7 text-foreground/85">{normalized}</p>
            </div>
          );
        }

        if (bullets.length === 1 && nonBullets.length === 0) {
          return (
            <div key={"bullet-" + index} className="flex gap-3 text-[1.02rem] leading-8 text-foreground/80">
              <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <p className="text-left">{bullets[0].replace(/^•\s*/, "")}</p>
            </div>
          );
        }

        const currentParagraph = paragraphIndex++;
        return (
          <p
            key={"paragraph-" + index}
            className={
              currentParagraph === 0
                ? "max-w-5xl text-lg leading-8 text-foreground/90 [text-align:justify] md:text-xl md:leading-9"
                : "max-w-6xl text-[1.03rem] leading-8 text-foreground/80 [text-align:justify]"
            }
          >
            {lines.join(" ")}
          </p>
        );
      })}
    </div>
  );
}

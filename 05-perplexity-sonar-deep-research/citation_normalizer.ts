/**
 * PERPLEXITY SONAR CITATION NORMALIZER & GOOGLE DOCS PAYLOAD BUILDER
 * Maps raw Perplexity Sonar bracket references [1], [2] to clickable hyperlinks
 * and generates structured document sections for Google Docs insertion.
 */

interface SonarResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
}

export const run = async (inputs: { sonarResponse: SonarResponse; topic: string }) => {
  const rawText = inputs.sonarResponse.choices[0]?.message?.content || "";
  const citations = inputs.sonarResponse.citations || [];

  // 1. Replace bracketed citation numbers [1], [2] with markdown hyperlinks
  let hyperlinkedText = rawText;
  citations.forEach((url, index) => {
    const citationIndex = index + 1;
    const regex = new RegExp(`\[${citationIndex}\]`, "g");
    hyperlinkedText = hyperlinkedText.replace(regex, `[[${citationIndex}]](${url})`);
  });

  // 2. Build structured Sources & References table
  let sourcesMarkdown = "\n\n### Verified Web Sources & Citations\n";
  citations.forEach((url, index) => {
    const domain = new URL(url).hostname.replace("www.", "");
    sourcesMarkdown += `${index + 1}. [${domain}](${url})\n`;
  });

  const fullDocumentMarkdown = `# Executive Intelligence Briefing: ${inputs.topic}\n\n` +
    `*Generated autonomously via Perplexity Sonar Pro & Activepieces*\n\n` +
    `---\n\n` +
    hyperlinkedText +
    sourcesMarkdown;

  return {
    topic: inputs.topic,
    sanitizedMarkdown: fullDocumentMarkdown,
    rawText: rawText,
    totalCitations: citations.length,
    citationsList: citations,
    timestampIso: new Date().toISOString()
  };
};

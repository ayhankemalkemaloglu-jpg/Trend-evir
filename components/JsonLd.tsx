/** Renders a JSON-LD structured-data script. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from trusted, in-repo config only.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

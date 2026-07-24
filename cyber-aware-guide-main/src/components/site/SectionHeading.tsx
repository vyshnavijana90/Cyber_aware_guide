export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
        {title.split(" ").map((w, i, a) =>
          i === a.length - 1 ? (
            <span key={i} className="text-gradient">
              {w}
            </span>
          ) : (
            <span key={i}>{w} </span>
          ),
        )}
      </h2>
      {description && <p className="text-muted-foreground text-lg">{description}</p>}
    </div>
  );
}

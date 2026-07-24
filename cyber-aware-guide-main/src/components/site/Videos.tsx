import { PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

const VIDEOS = [
  { id: "yrln8nyVBLU", title: "How to identify phishing emails" },
  { id: "o1Lo4Vfvx9Y", title: "UPI fraud awareness explained" },
  { id: "inWWhr5tnEA", title: "Cyber safety tips for everyone" },
];

export function Videos() {
  return (
    <section id="videos" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Watch & Learn"
          title="Educational Awareness Videos"
          description="Short videos from cyber experts to deepen your understanding."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {VIDEOS.map((v) => (
            <Card
              key={v.id}
              className="overflow-hidden group border-border hover:shadow-glow transition-shadow"
            >
              <div className="aspect-video bg-black relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 flex items-start gap-3">
                <PlayCircle className="size-5 text-primary mt-0.5 shrink-0" />
                <h3 className="font-medium">{v.title}</h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

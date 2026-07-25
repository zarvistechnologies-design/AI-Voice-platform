import Image from "next/image";

const productPhotos = {
  "product-overview": {
    src: "/service-images/team-workflow.jpg",
    alt: "A team working together around laptops in a shared workspace",
    caption: "The people, tools, and workflows behind production voice operations.",
  },
  "voice-agents": {
    src: "/images/voice-agents/real-customer-support.jpg",
    alt: "Customer support specialists working at their desks",
    caption: "Customer conversations, handled with care at real operating scale.",
  },
  "voice-cloning": {
    src: "/service-images/voice-studio.jpg",
    alt: "A studio microphone and headphones set up for a voice recording session",
    caption: "A controlled recording environment for building a consistent voice identity.",
  },
  "realtime-tts": {
    src: "/images/voice-agents/real-voice-workspace.jpg",
    alt: "A professional speaking into a studio microphone while wearing headphones",
    caption: "Natural speech tested where pacing, clarity, and responsiveness can be heard.",
  },
  "multilingual-speech": {
    src: "/service-images/multilingual-team.jpg",
    alt: "A multilingual team talking together in a modern office",
    caption: "Clear communication for teams and customers across languages and markets.",
  },
  "api-access": {
    src: "/service-images/developer-api.jpg",
    alt: "A developer workspace with code open on a laptop",
    caption: "Production voice capabilities ready to connect with the products you already build.",
  },
  "team-workflows": {
    src: "/service-images/team-workflow.jpg",
    alt: "A product team collaborating around laptops at a shared table",
    caption: "One shared workspace for the people who build, review, and operate voice agents.",
  },
  "speech-analytics": {
    src: "/service-images/voice-analytics.jpg",
    alt: "A computer displaying detailed analytics charts and performance metrics",
    caption: "Call activity translated into visible patterns, outcomes, and opportunities.",
  },
  "sentiment-detection": {
    src: "/service-images/sentiment-support.jpg",
    alt: "A focused customer support specialist listening through a headset",
    caption: "The moments that need more attention become easier to recognize and review.",
  },
  "conversation-insights": {
    src: "/service-images/conversation-insights.jpg",
    alt: "A person reviewing business analytics on a tablet at their desk",
    caption: "Patterns across customer conversations, brought into focus for the people who act on them.",
  },
  "quality-controls": {
    src: "/service-images/quality-review.jpg",
    alt: "A quality reviewer wearing a headset and checking written call notes",
    caption: "Human review and clear evidence remain part of every production workflow.",
  },
} as const;

type ProductServiceSlug = keyof typeof productPhotos;

export function ProductServiceHeroPhoto({ slug, title }: { slug: string; title: string }) {
  const photo = productPhotos[slug as ProductServiceSlug] ?? productPhotos["voice-agents"];

  return (
    <figure className="relative m-0 mx-auto w-full max-w-[650px] overflow-hidden rounded-[1.35rem] border border-white/12 bg-[#07100f] shadow-[0_28px_72px_rgba(0,0,0,0.52)]">
      <div className="relative h-[clamp(360px,30vw,430px)]">
        <Image
          alt={photo.alt}
          className="object-cover brightness-[0.78] saturate-[0.82]"
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 650px"
          src={photo.src}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,7,8,0.96),rgba(2,7,8,0.06)_60%),linear-gradient(115deg,rgba(var(--service-accent-rgb),0.10),transparent_52%)]"
        />
      </div>

      <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="service-accent-text text-[10px] font-black tracking-[0.14em] uppercase">{title}</p>
        <p className="mt-2 max-w-[31rem] text-sm leading-6 text-slate-200/80">{photo.caption}</p>
      </figcaption>
    </figure>
  );
}

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
    src: "/images/usecaseimages/voice_cloning.png",
    alt: "A studio microphone and headphones set up for a voice recording session",
    caption: "A controlled recording environment for building a consistent voice identity.",
  },
  "realtime-tts": {
    src: "/images/usecaseimages/realtime_tts.png",
    alt: "A professional speaking into a studio microphone while wearing headphones",
    caption: "Natural speech tested where pacing, clarity, and responsiveness can be heard.",
  },
  "multilingual-speech": {
    src: "/images/usecaseimages/multilanguage.png",
    alt: "A multilingual team talking together in a modern office",
    caption: "Clear communication for teams and customers across languages and markets.",
  },
  "api-access": {
    src: "/images/usecaseimages/api_access_1.png",
    alt: "A developer workspace with code open on a laptop",
    caption: "Production voice capabilities ready to connect with the products you already build.",
  },
  "team-workflows": {
    src: "/images/usecaseimages/team_workflow.png",
    alt: "A product team collaborating around laptops at a shared table",
    caption: "One shared workspace for the people who build, review, and operate voice agents.",
  },
  "speech-analytics": {
    src: "/images/usecaseimages/speech.png",
    alt: "A computer displaying detailed analytics charts and performance metrics",
    caption: "Call activity translated into visible patterns, outcomes, and opportunities.",
  },
  "sentiment-detection": {
    src: "/images/usecaseimages/sentiment.png",
    alt: "A focused customer support specialist listening through a headset",
    caption: "The moments that need more attention become easier to recognize and review.",
  },
  "conversation-insights": {
    src: "/images/usecaseimages/conversation.png",
    alt: "A person reviewing business analytics on a tablet at their desk",
    caption: "Patterns across customer conversations, brought into focus for the people who act on them.",
  },
  "quality-controls": {
    src: "/images/usecaseimages/quality_control.png",
    alt: "A quality reviewer wearing a headset and checking written call notes",
    caption: "Human review and clear evidence remain part of every production workflow.",
  },
} as const;

type ProductServiceSlug = keyof typeof productPhotos;

export function ProductServiceHeroPhoto({ slug, title, plain = false }: { slug: string; title: string; plain?: boolean }) {
  const photo = productPhotos[slug as ProductServiceSlug] ?? productPhotos["voice-agents"];

  if (plain) {
    return (
      <div className="relative mx-auto h-[390px] w-full max-w-[590px] bg-white sm:h-[450px] lg:h-[480px]">
        <Image
          alt={photo.alt}
          className={slug === "sentiment-detection" ? "scale-[0.84] object-contain object-center mix-blend-multiply" : "scale-[0.94] object-cover object-center mix-blend-multiply"}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 590px"
          src={photo.src}
          style={{ maskImage: "radial-gradient(ellipse 90% 90% at center, #000 75%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 90% 90% at center, #000 75%, transparent 100%)" }}
        />
      </div>
    );
  }

  return (
    <figure className="product-service-hero-photo relative m-0 mx-auto w-full max-w-[650px] overflow-hidden rounded-[1.35rem] border border-[#dedeea] bg-[#f7f6ff]">
      <div className="relative h-[clamp(360px,30vw,430px)]">
        <Image
          alt={photo.alt}
          className="object-cover brightness-[0.94] saturate-[0.86]"
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 650px"
          src={photo.src}
        />
      </div>

      <figcaption className="product-service-photo-caption absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent p-5 text-white sm:p-6">
        <p className="text-[10px] font-black tracking-[0.14em] uppercase">{title}</p>
        <p className="mt-2 max-w-[31rem] text-sm leading-6">{photo.caption}</p>
      </figcaption>
    </figure>
  );
}

import Image from "next/image";

export function VozonVoiceMark({ className }: { className?: string }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={className}
      height={80}
      src="/images/vozon-mark.svg"
      width={80}
    />
  );
}

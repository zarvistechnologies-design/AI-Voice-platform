"use client";

import { useRef, useState } from "react";

const bars = [13, 22, 31, 17, 38, 25, 42, 20, 33, 15, 27, 39, 22, 30, 17, 35, 21, 13, 25, 18, 30, 11, 21, 36, 16, 28, 14];

function clock(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

export function HealthcareAudioPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = async () => {
    if (!audio.current) return;
    if (audio.current.paused) await audio.current.play();
    else audio.current.pause();
  };

  return <div className="hcr-player">
    <audio onEnded={() => setPlaying(false)} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)} preload="metadata" ref={audio} src="/audio/vozon-appointment-preview.mp3" />
    <button aria-label={playing ? "Pause appointment call example" : "Play appointment call example"} onClick={() => void toggle()} type="button">{playing ? "Ⅱ" : "▶"}</button>
    <div aria-hidden="true" className="hcr-waveform">{bars.map((height, index) => <i className={duration > 0 && index / bars.length <= current / duration ? "is-played" : ""} key={index} style={{ height }} />)}</div>
    <span>{clock(current)} / {clock(duration)}</span>
  </div>;
}

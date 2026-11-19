import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentConnectedSection.css";

const voiceProviders = [
  { name: "ElevenLabs", icon: "/images/integrations/elevenlabs.png" },
  { name: "Cartesia", icon: "/images/integrations/cartesia.png" },
  { name: "Sarvam AI", icon: "/images/integrations/sarvam.png" },
  { name: "Deepgram", icon: "/images/integrations/deepgram.png" },
] as const;

export function VoiceCloningConnectedSection() {
  return (
    <section className="vc-connections" aria-labelledby="vc-clone-connections-title">
      <div className="hcr-wrap">
        <div className="vc-connections-heading">
          <span>ONE VOICE, CONNECTED TO EVERY CALL</span>
          <h2 id="vc-clone-connections-title">From an approved recording to a live conversation.</h2>
          <p>
            Give your voice profile the pronunciation rules, consent controls, and low-latency streaming it needs for real customer calls.
          </p>
        </div>

        <div className="vc-connection-stack">
          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>01 / REAL-TIME SYNTHESIS</span>
              <h3>Streamed naturally on live calls</h3>
              <p>
                As your agent generates a reply, the approved voice streams immediately over the phone line so conversations stay responsive and natural.
              </p>
              <div className="vc-connection-note">
                <Icon name="waveform" /> Responsive turn-taking without awkward pauses.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-tools-visual"
              role="img"
              aria-label="Real-time voice synthesis pipeline from agent reply to live caller"
            >
              <div className="vc-tool-entry">
                <span><Icon name="mic" /></span>
                <div>
                  <small>AGENT REPLY</small>
                  <strong>“I have confirmed your booking for Wednesday at 2:30 PM.”</strong>
                </div>
              </div>
              <div className="vc-tool-flow">
                <div>
                  <span><Icon name="sliders" /></span>
                  <strong>Pronunciation</strong>
                  <small>Terms checked</small>
                </div>
                <i />
                <div>
                  <span><Icon name="waveform" /></span>
                  <strong>Voice Stream</strong>
                  <small>Cloned timbre</small>
                </div>
                <i />
                <div>
                  <span><Icon name="phone" /></span>
                  <strong>Live Call</strong>
                  <small>WebRTC / SIP</small>
                </div>
              </div>
              <div className="vc-tool-outcome">
                <Icon name="check" /> First audio streamed in 92ms
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>02 / PRONUNCIATION & SCRIPTS</span>
              <h3>Clear on the words that matter</h3>
              <p>
                Test how your voice reads product names, places, and key policy phrases before deployment so callers hear a clear, accurate response.
              </p>
              <div className="vc-connection-note">
                <Icon name="file" /> Custom phonetic dictionary per workspace.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-knowledge-visual"
              role="img"
              aria-label="Pronunciation dictionary and script verification"
            >
              <div className="vc-knowledge-question">
                <span><Icon name="mic" /></span>
                <div>
                  <small>SCRIPT REVIEW</small>
                  <strong>“Welcome to Vozon. Let me check your policy reference.”</strong>
                </div>
              </div>
              <div className="vc-knowledge-source">
                <div>
                  <Icon name="sliders" />
                  <span>
                    <strong>Phonetic Guide</strong>
                    <small>Brand & product terms</small>
                  </span>
                </div>
                <div>
                  <Icon name="globe" />
                  <span>
                    <strong>Locale Check</strong>
                    <small>English & Indic scripts</small>
                  </span>
                </div>
              </div>
              <div className="vc-knowledge-answer">
                <Icon name="spark" />
                <span>
                  <small>APPROVED VOICE OUTPUT</small>
                  <strong>Consistent tone across greetings, answers, and follow-ups.</strong>
                </span>
              </div>
            </div>
          </article>

          <article className="vc-connection-card">
            <div className="vc-connection-copy">
              <span>03 / CONSENT & VOICE PROVIDERS</span>
              <h3>Governed from studio to phone line</h3>
              <p>
                Keep speaker authorization attached to the voice profile and run across supported low-latency synthesis providers.
              </p>
              <div className="vc-connection-note">
                <Icon name="shield" /> Used only with verified permission and scope.
              </div>
            </div>
            <div
              className="vc-connection-visual vc-telephony-visual"
              role="img"
              aria-label="Voice consent and provider routing"
            >
              <div className="vc-phone-route">
                <div>
                  <span><Icon name="shield" /></span>
                  <strong>Verified Consent</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="mic" /></span>
                  <strong>Vozon Voice Studio</strong>
                </div>
                <i />
                <div>
                  <span><Icon name="phone" /></span>
                  <strong>Active Agents</strong>
                </div>
              </div>
              <div className="vc-provider-label">SUPPORTED VOICE SYNTHESIS ENGINES</div>
              <div className="vc-provider-grid">
                {voiceProviders.map((provider) => (
                  <div key={provider.name}>
                    <Image alt="" src={provider.icon} width={18} height={18} />
                    <strong>{provider.name}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { VoiceAgentVisualIcon as Icon } from "./VoiceAgentVisualIcon";
import "./VoiceAgentOverview.css";

const features = [
  {
    icon: "mic" as const,
    title: "Authorized voice studio",
    body: "Create a consistent synthetic voice from authorized studio recordings with verified speaker permission.",
  },
  {
    icon: "globe" as const,
    title: "Consistent across languages",
    body: "Keep a recognizable tone and speaking style across English, Indian languages, and global markets.",
  },
  {
    icon: "sliders" as const,
    title: "Pronunciation & pacing control",
    body: "Review how the voice reads your company name, product terms, and numbers before putting it on live calls.",
  },
  {
    icon: "shield" as const,
    title: "Consent & usage governance",
    body: "Keep speaker consent, approved scripts, and agent assignment rules attached to every voice profile.",
  },
];

const voiceEngines = [
  { name: "ElevenLabs", icon: "/images/integrations/elevenlabs.png" },
  { name: "Cartesia", icon: "/images/integrations/cartesia.png" },
  { name: "Sarvam AI", icon: "/images/integrations/sarvam.png" },
  { name: "Deepgram", icon: "/images/integrations/deepgram.png" },
  { name: "Twilio", icon: "/images/integrations/twilio.svg" },
  { name: "WhatsApp", icon: "/images/integrations/whatsapp.svg" },
] as const;

export function VoiceCloningOverview() {
  return (
    <div className="vc-overview">
      <section className="vc-features hcr-wrap" aria-labelledby="vc-clone-features-title">
        <span className="vc-overview-kicker">BUILT FOR RECOGNIZABLE BRAND CONVERSATIONS</span>
        <h2 id="vc-clone-features-title">One familiar voice. Reviewed for every call.</h2>
        <div className="vc-feature-grid">
          {features.map((feature) => (
            <article key={feature.title}>
              <Icon name={feature.icon} />
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vc-deploy hcr-wrap" aria-labelledby="vc-clone-deploy-title">
        <span className="vc-overview-kicker">FROM SOURCE SAMPLE TO LIVE AGENT</span>
        <h2 id="vc-clone-deploy-title">Create once, review carefully, and apply.</h2>
        <div className="vc-deploy-grid">
          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-template-visual" aria-hidden="true">
              <div className="vc-template-row is-current">
                <span className="vc-template-symbol"><Icon name="mic" /></span>
                <div>
                  <strong>Authorized studio recording</strong>
                  <small>Clean 48kHz reference voice sample</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="shield" /></span>
                <div>
                  <strong>Speaker consent verified</strong>
                  <small>Permission & usage scope recorded</small>
                </div>
                <i>↗</i>
              </div>
              <div className="vc-template-row">
                <span className="vc-template-symbol"><Icon name="sliders" /></span>
                <div>
                  <strong>Pronunciation dictionary</strong>
                  <small>Brand names & domain terms checked</small>
                </div>
                <i>↗</i>
              </div>
            </div>
            <h3>Start with authorized material</h3>
            <p>Upload a clean voice sample you have permission to use and attach the speaker consent record.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-language-visual" aria-hidden="true">
              <div className="vc-language-top">
                <span>BRAND VOICE</span>
                <i />
                <span>MULTILINGUAL</span>
              </div>
              <div className="vc-language-chips">
                <span>English</span>
                <span>हिन्दी</span>
                <span>ગુજરાતી</span>
                <span>ಕನ್ನಡ</span>
                <span>বাংলা</span>
                <span>मराठी</span>
                <span>தமிழ்</span>
                <span>Español</span>
              </div>
              <small>Test key phrases in every language you support.</small>
            </div>
            <h3>Review across languages</h3>
            <p>Hear how the voice handles greetings, product terms, and follow-ups in the languages your callers speak.</p>
          </article>

          <article className="vc-deploy-card">
            <div className="vc-deploy-visual vc-apps-visual" aria-hidden="true">
              <div className="vc-app-icons">
                {voiceEngines.map((item) => (
                  <span key={item.name} title={item.name}>
                    <Image src={item.icon} alt="" width={27} height={27} />
                  </span>
                ))}
              </div>
              <div className="vc-apps-caption">VOICE ENGINES & CHANNELS</div>
            </div>
            <h3>Apply to your voice agents</h3>
            <p>Assign the approved voice profile to your inbound and outbound Vozon agents with one click.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

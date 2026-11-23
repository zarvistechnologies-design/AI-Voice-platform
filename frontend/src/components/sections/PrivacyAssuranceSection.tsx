import Image from "next/image";
import Link from "next/link";
import "./PrivacyAssuranceSection.css";

export function PrivacyAssuranceSection() {
  return (
    <section aria-labelledby="privacy-assurance-title" className="privacy-assurance">
      <div className="privacy-assurance-card">
        <div className="privacy-assurance-copy">
          <span className="privacy-assurance-eyebrow"><i aria-hidden="true" /> ENTERPRISE SECURITY &amp; COMPLIANCE</span>
          <h2 id="privacy-assurance-title">Private when<br />you need it.</h2>
          <p>SOC 2 Type II audited and ISO 27001 certified.<br />When data can’t leave your infrastructure,<br />Vozon deploys the whole stack on-premise or<br />in your private cloud, with a small language<br />model, Parrot speech-to-text and a text-<br />to-speech model, all hosted in-house.</p>
          <Link className="privacy-assurance-link" href="/resources/trust-center">Trust Center →</Link>
        </div>
        <Image
          alt="GDPR, HIPAA compliant, ISO 27001, and SOC 2 badges"
          className="privacy-assurance-badges-image"
          height={1184}
          src="/images/privacy-compliance-badges.png"
          width={1328}
        />
      </div>
    </section>
  );
}

import React from 'react';
import './Terms.css';

const Terms: React.FC = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-title">Terms and Conditions</h1>
      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Acceptance of Terms</h2>
          <p>Welcome to Dusted ("we," "us," "our"). These Terms of Service ("Terms") govern your access to and use of www.dustedfilm.com and any related services (collectively, "Services"). By creating an account or otherwise using the Services, you agree to be bound by these Terms.</p>
        </section>

        <section className="terms-section">
          <h2>2. Eligibility</h2>
          <p>You must be at least 13 years old to use our Services. By registering, you confirm that you meet this requirement and have the legal capacity to enter into these Terms.</p>
        </section>

        <section className="terms-section">
          <h2>3. Account Registration & Login</h2>
          <p>3.1 Account Creation. To access certain features, you must register for an account by providing a valid email address and password. You're responsible for keeping your credentials secure.</p>
          <p>3.2 Third-Party Social Login. We offer login via third-party providers (e.g., Google, Facebook). You authorize us to access basic profile information (name, email, profile picture) from those providers. Your use of these login options is subject to the providers' terms and policies.</p>
        </section>

        <section className="terms-section">
          <h2>4. Subscription, Billing & Payment</h2>
          <p>4.1 Subscription Plans. Premium features require a recurring monthly subscription. Current pricing is displayed on our site.</p>
          <p>4.2 Automatic Renewal. Subscriptions auto-renew each month at the then-current rate. We'll charge your payment method on file unless you cancel before renewal.</p>
          <p>4.3 Payment Methods. We accept major credit cards and other payment methods offered at checkout.</p>
          <p>4.4 Cancellation & Refunds. You can cancel anytime via account settings. Cancellation takes effect at period end; fees already paid are non-refundable, except as required by law.</p>
        </section>

        <section className="terms-section">
          <h2>5. User Content</h2>
          <p>5.1 Your Content. You retain ownership of any content you upload or post ("User Content"). By submitting it, you grant Dusted a worldwide, royalty-free license to host, display, and distribute that content in connection with the Services.</p>
          <p>5.2 Prohibited Content. You agree not to post anything unlawful, infringing, obscene, defamatory, or otherwise objectionable.</p>
          <p>5.3 Moderation Rights. We may review, remove, or disable access to any User Content at our discretion and without notice.</p>
        </section>

        <section className="terms-section">
          <h2>6. Intellectual Property</h2>
          <p>All materials on the Site (text, graphics, logos, code) are owned by Dusted or its licensors. You may not copy, modify, distribute, or create derivative works without prior written permission.</p>
        </section>

        <section className="terms-section">
          <h2>7. Privacy</h2>
          <p>Your use of the Services is governed by our Privacy Policy, available at [Privacy Policy link], which explains how we collect, use, and share your data.</p>
        </section>

        <section className="terms-section">
          <h2>8. Third-Party Services</h2>
          <p>We may link to or integrate with third-party sites, services, or APIs. Your interactions with those are governed by their own terms and privacy practices. We're not responsible for their content or policies.</p>
        </section>

        <section className="terms-section">
          <h2>9. Disclaimers</h2>
          <p>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.</p>
        </section>

        <section className="terms-section">
          <h2>10. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, DUSTED WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES.</p>
        </section>

        <section className="terms-section">
          <h2>11. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless Dusted and its affiliates from any claims, liabilities, damages, or expenses arising out of your breach of these Terms or your use of the Services.</p>
        </section>

        <section className="terms-section">
          <h2>12. Governing Law</h2>
          <p>These Terms are governed by the laws of [JURISDICTION], without regard to conflict-of-law principles.</p>
        </section>

        <section className="terms-section">
          <h2>13. Changes to Terms</h2>
          <p>We may update these Terms at any time. Significant changes will be communicated via the Site or email. Continued use after updates constitutes your acceptance.</p>
        </section>

        <section className="terms-section">
          <h2>14. Termination</h2>
          <p>We reserve the right to suspend or terminate your access for violations of these Terms or misuse of the Services.</p>
        </section>

        <section className="terms-section">
          <h2>15. Contact Us</h2>
          <p>If you have questions or need support, email jaeshinkorean@gmail..com.</p>
        </section>
      </div>

      <div className="terms-footer">
        <p>Last updated: May 13, 2025</p>
      </div>
    </div>
  );
};

export default Terms;

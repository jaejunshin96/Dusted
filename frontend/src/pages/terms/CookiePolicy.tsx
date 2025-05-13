import React from 'react';
import './CookiePolicy.css';

const CookiePolicy: React.FC = () => {
  return (
    <div className="cookie-container">
      <h1 className="cookie-title">Dusted Cookie Policy</h1>
      <div className="cookie-content">
        <section className="cookie-section">
          <p className="effective-date">Effective Date: May 13, 2025</p>

          <p>
            We use cookies to help improve your experience of our website at https://dustedfilm.com.
            This cookie policy is part of Dusted's privacy policy. It covers the use of cookies between
            your device and our site.
          </p>
          <p>
            We also provide basic information on third-party services we may use, who may also use
            cookies as part of their service. This policy does not cover their cookies.
          </p>
          <p>
            If you don't wish to accept cookies from us, you should instruct your browser to refuse
            cookies from https://dustedfilm.com. In such a case, we may be unable to provide you with
            some of your desired content and services.
          </p>
        </section>

        <section className="cookie-section">
          <h2>What is a cookie?</h2>
          <p>
            A cookie is a small piece of data that a website stores on your device when you visit.
            It typically contains information about the website itself, a unique identifier that allows
            the site to recognise your web browser when you return, additional data that serves the
            cookie's purpose, and the lifespan of the cookie itself.
          </p>
          <p>
            Cookies are used to enable certain features (e.g. logging in), track site usage (e.g. analytics),
            store your user settings (e.g. time zone, notification preferences), and to personalize your
            content (e.g. advertising, language).
          </p>
          <p>
            Cookies set by the website you are visiting are usually referred to as first-party cookies.
            They typically only track your activity on that particular site.
          </p>
          <p>
            Cookies set by other sites and companies (i.e. third parties) are called third-party cookies.
            They can be used to track you on other websites that use the same third-party service.
          </p>
        </section>

        <section className="cookie-section">
          <h2>How Can You Control Our Website's Use of Cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies on our Website. You can
            manage your cookie preferences in our Cookie Consent Manager. The Cookie Consent Manager
            allows you to select which categories of cookies you accept or reject. Essential cookies
            cannot be rejected as they are strictly necessary to provide you with the services on our Website.
          </p>
          <p>
            You may also be able to set or amend your cookie preferences by managing your web browser settings.
            As each web browser is different, please consult the instructions provided by your web browser
            (typically in the "help" section). If you choose to refuse or disable cookies you may still use
            the Website, though some of the functionality of the Website may not be available to you.
          </p>
        </section>

        <section className="cookie-section">
          <h2>How Often Will We Update This Cookie Policy?</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect any changes to the
            cookies and related technologies we use, or for other operational, legal or regulatory reasons.
          </p>
          <p>
            Each time you use our Website, the current version of the Cookie Policy will apply. When you
            use our Website, you should check the date of this Cookie Policy (which appears at the top of
            this document) and review any changes since the last version.
          </p>
        </section>

        <section className="cookie-section">
          <h2>Where Can You Obtain Further Information?</h2>
          <p>
            For any questions or concerns regarding our Cookie Policy, you may contact us using the following details:
          </p>
          <p>
            Dusted<br />
            jaeshinkorean@gmail.com
          </p>
        </section>
      </div>

      <div className="cookie-footer">
        <p>Last updated: May 13, 2025</p>
      </div>
    </div>
  );
};

export default CookiePolicy;

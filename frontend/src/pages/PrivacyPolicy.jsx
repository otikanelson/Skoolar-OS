import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mx-auto px-16 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm font-semibold text-gray-900 mb-8">Effective Date: February 8, 2026</p>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to EduCore OS. Your privacy is extremely important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website, <a href="https://educore.ng" className="text-[#1e3a8a] hover:underline">https://educore.ng</a> (the "Site"). Our goal is to ensure full transparency and compliance with applicable data protection laws, including the Nigeria Data Protection Regulation (NDPR), and other relevant privacy regulations.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            We encourage you to read this policy carefully. By using our website, you agree to the practices described in this Privacy Policy.
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <p className="leading-relaxed mb-4">
              When you visit EduCore OS, we may collect both <strong>personally identifiable</strong> and <strong>non-personally identifiable</strong> information. Personally identifiable information includes details like your name and email address, which we collect only when you voluntarily provide them—such as when you subscribe to our newsletter, fill out a contact form, or download resources.
            </p>
            
            <p className="leading-relaxed">
              Non-personal data, such as your browser type, device information, IP address, pages viewed, referral source, and time spent on the site, may be collected automatically through cookies and similar technologies. This data helps us understand how visitors interact with our platform and improve user experience.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            
            <p className="leading-relaxed mb-4">We use the information we collect for the following purposes:</p>
            
            <ul className="space-y-3 ml-6">
              <li className="leading-relaxed"><strong>To Provide Services:</strong> Deliver the academic management platform and related services to schools, teachers, students, and parents.</li>
              <li className="leading-relaxed"><strong>To Communicate:</strong> Send you updates, newsletters, promotional materials, and respond to your inquiries.</li>
              <li className="leading-relaxed"><strong>To Improve Our Platform:</strong> Analyze usage patterns to enhance functionality, user experience, and develop new features.</li>
              <li className="leading-relaxed"><strong>To Ensure Security:</strong> Monitor and protect against fraudulent activity, unauthorized access, and security threats.</li>
              <li className="leading-relaxed"><strong>To Comply with Legal Obligations:</strong> Meet regulatory requirements and respond to legal requests.</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Cookies and Tracking Technologies</h2>
            
            <p className="leading-relaxed mb-4">
              EduCore OS uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us remember your preferences, analyze site traffic, and personalize content.
            </p>
            
            <p className="leading-relaxed mb-4">We use the following types of cookies:</p>
            
            <ul className="space-y-3 ml-6">
              <li className="leading-relaxed"><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
              <li className="leading-relaxed"><strong>Analytics Cookies:</strong> Help us understand how visitors use our site.</li>
              <li className="leading-relaxed"><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
              <li className="leading-relaxed"><strong>Marketing Cookies:</strong> Track your activity to deliver relevant advertisements.</li>
            </ul>
            
            <p className="leading-relaxed mt-4">
              You can control cookie settings through your browser preferences. However, disabling cookies may affect your ability to use certain features of our website.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            
            <p className="leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
            </p>
            
            <ul className="space-y-3 ml-6">
              <li className="leading-relaxed"><strong>Service Providers:</strong> We work with trusted third-party vendors who assist in operating our platform, processing payments, and providing analytics. These providers are contractually obligated to protect your data.</li>
              <li className="leading-relaxed"><strong>School Personnel:</strong> Authorized staff members within registered schools have access to relevant student and academic data.</li>
              <li className="leading-relaxed"><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or to protect our rights and safety.</li>
              <li className="leading-relaxed"><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            
            <p className="leading-relaxed mb-4">
              We take the security of your personal information seriously and implement industry-standard measures to protect it from unauthorized access, alteration, disclosure, or destruction. Our security practices include:
            </p>
            
            <ul className="space-y-3 ml-6">
              <li className="leading-relaxed">Encryption of data in transit and at rest using SSL/TLS protocols</li>
              <li className="leading-relaxed">Regular security audits and vulnerability assessments</li>
              <li className="leading-relaxed">Role-based access controls and authentication mechanisms</li>
              <li className="leading-relaxed">Secure data centers with physical and network security</li>
              <li className="leading-relaxed">Employee training on data protection and privacy best practices</li>
            </ul>
            
            <p className="leading-relaxed mt-4">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            
            <p className="leading-relaxed mb-4">
              Under the Nigeria Data Protection Regulation (NDPR) and other applicable laws, you have the following rights regarding your personal information:
            </p>
            
            <ul className="space-y-3 ml-6">
              <li className="leading-relaxed"><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li className="leading-relaxed"><strong>Right to Rectification:</strong> Correct any inaccurate or incomplete information.</li>
              <li className="leading-relaxed"><strong>Right to Erasure:</strong> Request deletion of your personal data, subject to legal obligations.</li>
              <li className="leading-relaxed"><strong>Right to Object:</strong> Object to the processing of your data for certain purposes.</li>
              <li className="leading-relaxed"><strong>Right to Data Portability:</strong> Receive your data in a structured, commonly used format.</li>
              <li className="leading-relaxed"><strong>Right to Withdraw Consent:</strong> Withdraw your consent for data processing at any time.</li>
            </ul>
            
            <p className="leading-relaxed mt-4">
              To exercise any of these rights, please contact us at <a href="mailto:privacy@educore.ng" className="text-[#1e3a8a] hover:underline">privacy@educore.ng</a>.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            
            <p className="leading-relaxed">
              EduCore OS is designed for use by educational institutions to manage academic records. We collect and process student information only with the consent and authorization of schools and parents/guardians. We do not knowingly collect personal information from children under 13 without proper parental consent. If you believe we have inadvertently collected such information, please contact us immediately so we can take appropriate action.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            
            <p className="leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. Student academic records are typically retained for seven (7) years after graduation or withdrawal, in accordance with educational record-keeping requirements. You may request deletion of your data, subject to legal and contractual obligations.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            
            <p className="leading-relaxed">
              Your personal data is primarily stored and processed within Nigeria. If we transfer data to other countries, we ensure that appropriate safeguards are in place to protect your information in accordance with applicable data protection laws, including the use of standard contractual clauses and other legal mechanisms.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
            
            <p className="leading-relaxed">
              Our website may contain links to third-party websites or services that are not operated by us. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. When we make material changes, we will notify you by posting the updated policy on our website and updating the "Effective Date" at the top of this page. We encourage you to review this policy periodically. Your continued use of the platform after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            
            <p className="leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="font-semibold text-gray-900 mb-3">EduCore OS</p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:privacy@educore.ng" className="text-[#1e3a8a] hover:underline">privacy@educore.ng</a></p>
              <p className="text-gray-700 mb-2">Support: <a href="mailto:support@educore.ng" className="text-[#1e3a8a] hover:underline">support@educore.ng</a></p>
              <p className="text-gray-700 mb-2">Phone: +234 801 234 5678</p>
              <p className="text-gray-700">Address: Lagos, Nigeria</p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">NDPR Compliance Statement</h2>
            
            <p className="leading-relaxed">
              EduCore OS is committed to full compliance with the Nigeria Data Protection Regulation (NDPR) 2019 and other applicable data protection laws. We have implemented appropriate technical and organizational measures to ensure the security, confidentiality, and integrity of personal data processed through our platform. Our data protection practices are regularly reviewed and updated to maintain the highest standards of privacy protection.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
              <Link to="/" className="text-[#1e3a8a] hover:underline">Return to Home</Link>
              {' '} | {' '}
              <Link to="/terms" className="text-[#1e3a8a] hover:underline">Terms of use</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

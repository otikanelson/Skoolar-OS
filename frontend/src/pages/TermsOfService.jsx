import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="mx-auto px-16 py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm font-semibold text-gray-900 mb-8">Effective Date: February 8, 2026</p>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to Skoolar. These Terms of Service ("Terms") govern your access to and use of the Skoolar platform and services. By accessing or using our platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            Please read these Terms carefully before using the platform.
          </p>
        </div>

        <div className="space-y-8 text-gray-700">
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using the Skoolar platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms apply to all users, including schools, administrators, teachers, students, and parents.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="leading-relaxed mb-4">
              Skoolar provides a comprehensive academic management platform for Nigerian secondary schools, including:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="leading-relaxed">Student records management</li>
              <li className="leading-relaxed">Result processing and report card generation</li>
              <li className="leading-relaxed">Computer-based testing (CBT) system</li>
              <li className="leading-relaxed">Parent portal access</li>
              <li className="leading-relaxed">Communication tools</li>
              <li className="leading-relaxed">Analytics and reporting</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">3. Account Registration and Security</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">3.1 School Registration</h3>
            <p className="leading-relaxed mb-4">
              Schools must complete the registration process and receive approval before accessing the platform. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">3.2 Account Security</h3>
            <p className="leading-relaxed mb-4">You are responsible for:</p>
            <ul className="space-y-2 ml-6">
              <li className="leading-relaxed">Maintaining the confidentiality of your account credentials</li>
              <li className="leading-relaxed">All activities that occur under your account</li>
              <li className="leading-relaxed">Notifying us immediately of any unauthorized access</li>
              <li className="leading-relaxed">Ensuring users comply with these Terms</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">4. Subscription and Payment</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.1 Fees</h3>
            <p className="leading-relaxed mb-4">
              Use of the Service requires payment of subscription fees as outlined in your selected plan. Fees are charged on a per-student monthly basis plus applicable setup fees.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.2 Payment Terms</h3>
            <ul className="space-y-2 ml-6 mb-4">
              <li className="leading-relaxed">Subscription fees are billed in advance on a monthly or annual basis</li>
              <li className="leading-relaxed">Payment is due within 30 days of invoice date</li>
              <li className="leading-relaxed">Late payments may result in service suspension</li>
              <li className="leading-relaxed">All fees are in Nigerian Naira (₦) unless otherwise stated</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.3 Refunds</h3>
            <p className="leading-relaxed">
              Setup fees are non-refundable. Subscription fees may be refunded on a pro-rata basis if you cancel within the first 30 days. After 30 days, no refunds will be provided for early termination.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">5.1 Permitted Use</h3>
            <p className="leading-relaxed mb-4">
              You may use the Service only for lawful purposes and in accordance with these Terms. The Service is intended for academic management purposes only.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">5.2 Prohibited Activities</h3>
            <p className="leading-relaxed mb-4">You agree not to:</p>
            <ul className="space-y-2 ml-6">
              <li className="leading-relaxed">Violate any applicable laws or regulations</li>
              <li className="leading-relaxed">Infringe on intellectual property rights</li>
              <li className="leading-relaxed">Upload malicious code or viruses</li>
              <li className="leading-relaxed">Attempt to gain unauthorized access to the Service</li>
              <li className="leading-relaxed">Interfere with or disrupt the Service</li>
              <li className="leading-relaxed">Use the Service for any commercial purpose outside of school operations</li>
              <li className="leading-relaxed">Share account credentials with unauthorized parties</li>
              <li className="leading-relaxed">Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">6. Data Ownership and Usage</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">6.1 Your Data</h3>
            <p className="leading-relaxed mb-4">
              You retain all rights to the data you input into the Service ("Your Data"). You grant us a license to use Your Data solely to provide and improve the Service.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">6.2 Our Rights</h3>
            <p className="leading-relaxed">
              We own all rights to the Service, including software, designs, and documentation. You may not copy, modify, or distribute any part of the Service without our written permission.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
            <p className="leading-relaxed mb-4">
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. We may:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="leading-relaxed">Perform scheduled maintenance with advance notice</li>
              <li className="leading-relaxed">Suspend service for emergency maintenance</li>
              <li className="leading-relaxed">Modify or discontinue features with reasonable notice</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SKOOLAR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
            <p className="leading-relaxed">
              Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
            <p className="leading-relaxed">
              You agree to indemnify and hold harmless Skoolar from any claims, damages, losses, liabilities, and expenses arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">10. Termination</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">10.1 By You</h3>
            <p className="leading-relaxed mb-4">
              You may terminate your subscription at any time by providing 30 days written notice. You remain responsible for all fees incurred prior to termination.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">10.2 By Us</h3>
            <p className="leading-relaxed mb-4">
              We may suspend or terminate your access if:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="leading-relaxed">You violate these Terms</li>
              <li className="leading-relaxed">Payment is more than 30 days overdue</li>
              <li className="leading-relaxed">We are required to do so by law</li>
              <li className="leading-relaxed">Continued provision would cause us legal liability</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">11. Confidentiality</h2>
            <p className="leading-relaxed">
              Both parties agree to maintain the confidentiality of any proprietary or confidential information disclosed during the course of using the Service. This obligation survives termination of these Terms.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">12. Modifications to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes via email or platform notification. Continued use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the courts of Lagos State, Nigeria.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">14. Dispute Resolution</h2>
            <p className="leading-relaxed">
              In the event of any dispute, the parties agree to first attempt resolution through good faith negotiations. If unsuccessful, disputes may be submitted to mediation before pursuing litigation.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">15. Severability</h2>
            <p className="leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
            <p className="leading-relaxed mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-6">
              <p className="font-semibold text-gray-900 mb-3">Skoolar</p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:legal@skoolar.com" className="text-[#1e3a8a] hover:underline">legal@skoolar.com</a></p>
              <p className="text-gray-700 mb-2">Phone: +234 801 234 5678</p>
              <p className="text-gray-700">Address: Lagos, Nigeria</p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-600 italic">
              By using Skoolar, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
              <Link to="/" className="text-[#1e3a8a] hover:underline">Return to Home</Link>
              {' '} | {' '}
              <Link to="/privacy" className="text-[#1e3a8a] hover:underline">Privacy</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;

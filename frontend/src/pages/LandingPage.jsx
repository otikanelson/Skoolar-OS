import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BgImage from '../assets/BgImage.jpeg';
import BgImage2 from '../assets/BgImage2.jpeg';
import BgImage3 from '../assets/BgImage3.jpeg';
import BgImage4 from '../assets/BgImage4.jpeg';
import BgImage5 from '../assets/BgImage5.jpeg';
import PFP1 from '../assets/PFP.jpg';
import PFP2 from '../assets/PFP2.jpg';
import PFP3 from '../assets/PFP3.jpg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TourGuide from '../components/TourGuide';

const LandingPage = () => {
  const backgroundImages = [BgImage, BgImage2, BgImage3, BgImage4, BgImage5];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const testimonials = [
    {
      quote: "EduCore has transformed how we manage our academic operations. What used to take days now takes minutes. The system is intuitive, reliable, and has significantly reduced our administrative burden.",
      name: "Mrs. Oluwaseun Adeyemi",
      role: "Principal, Grace International School",
      image: PFP1
    },
    {
      quote: "As a teacher, I appreciate how easy it is to record assessments and track student progress. The automated result computation saves me hours every term, and parents love the instant access to report cards.",
      name: "Mr. Chukwudi Okonkwo",
      role: "Senior Teacher, Victory Academy",
      image: PFP2
    },
    {
      quote: "The computer-based examination feature has been a game-changer for our school. Students are more engaged, and we can conduct tests efficiently without the usual logistical challenges.",
      name: "Dr. Abdhul Bello",
      role: "Vice Principal, Crescent College",
      image: PFP3
    },
    {
      quote: "Managing multiple classes and hundreds of students used to be overwhelming. EduCore brought structure and clarity to our operations. I can now focus on improving education quality rather than drowning in paperwork.",
      name: "Mr. Tunde Ajayi",
      role: "School Administrator, Bright Future Schools",
      image: null
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Header />
      <TourGuide />

      {/* Hero Section with Sliding Background */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden">
        {/* Animated Background Images */}
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentBgIndex === index ? 1 : 0,
              }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 41, 59, 0.85)), url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-28">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Academic Management Made Simple
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
              EduCore is a centralized platform that helps schools manage academic records, 
              assessments, and internal examinations within one secure environment.
            </p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block bg-white px-4 sm:px-6 py-2.5 sm:py-3 rounded border border-gray-300"
            >
              <Link 
                to="/contact-sales"
                id="custom-domain-button"
                className="text-sm sm:text-base font-mono text-[#1e3a8a] font-semibold hover:text-blue-700 transition-colors"
              >
                Get a custom Portal Domain
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* What the System Handles */}
      <div id="features-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 md:mb-12 text-center"
        >
          What the System Handles
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {[
            {
              title: 'Student Records & Class Structure',
              desc: 'Maintain complete student profiles, class assignments, and academic history in a structured digital format.',
            },
            {
              title: 'Continuous Assessments & Results',
              desc: 'Record scores, process results through approval workflows, and generate report cards with automated computation.',
            },
            {
              title: 'Computer-Based Internal Examinations',
              desc: 'Conduct structured internal exams with question banks, timed sessions, and automated marking.',
            },
            {
              title: 'Staff Access with Role-Based Permissions',
              desc: 'Secure access control for administrators, teachers, and department heads with appropriate permissions.',
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideIn}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 p-5 sm:p-6 md:p-7 hover:border-[#1e3a8a] transition-colors"
            >
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideIn}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border border-gray-200 p-5 sm:p-6 md:p-7 md:col-span-2 hover:border-[#1e3a8a] transition-colors"
          >
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">Parent Visibility into Academic Progress</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Parents access results, download report cards, and track academic performance through secure portals.
            </p>
          </motion.div>
        </div>
      </div>

      {/* How Schools Get Started */}
      <div id="onboarding-section" className="bg-white border-y border-gray-200 py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center"
          >
            Simple School Onboarding
          </motion.h2>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-sm sm:text-base md:text-lg text-gray-600 mb-10 sm:mb-12 md:mb-16 max-w-2xl mx-auto px-2"
          >
            EduCore is designed for easy adoption without disrupting existing school operations.
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
            {[
              { num: '1', title: 'Portal Creation', desc: 'A branded portal is created with your school\'s name, logo, and structure.' },
              { num: '2', title: 'Academic Setup', desc: 'Classes, subjects, grading formats, and staff accounts are configured.' },
              { num: '3', title: 'Data Upload', desc: 'Student and teacher records are securely imported to prepare for use.' },
              { num: '4', title: 'Go Live', desc: 'All users receive login access and the school begins managing academics digitally.' }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#1e3a8a] text-white rounded font-bold flex items-center justify-center mx-auto mb-4 sm:mb-5 text-xl sm:text-2xl">
                  {step.num}
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-sm sm:text-base text-gray-600 mt-10 sm:mt-12 md:mt-16 italic px-2"
          >
            A structured transition from manual processes to a reliable digital workflow.
          </motion.p>
        </div>
      </div>

      {/* Built for Everyday Use */}
      <div id="users-section" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center"
        >
          Built Around Real School Workflows
        </motion.h2>
        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-sm sm:text-base md:text-lg text-gray-600 mb-10 sm:mb-12 md:mb-14 max-w-2xl mx-auto px-2"
        >
          EduCore supports the tasks schools already perform — now with greater speed, accuracy, and visibility.
        </motion.p>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {[
            { title: 'For Administrators', desc: 'Manage records, oversee results, and maintain academic structure from a single dashboard.' },
            { title: 'For Teachers', desc: 'Record scores, manage assessments, and prepare exam workflows without manual calculations.' },
            { title: 'For Students', desc: 'Take structured internal exams and access results in a consistent format.' },
            { title: 'For Parents', desc: 'View academic progress through secure, mobile-friendly access.' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideIn}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 p-5 sm:p-6 md:p-7 hover:border-[#1e3a8a] transition-colors"
            >
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm sm:text-base text-gray-600 mt-10 sm:mt-12 md:mt-14 italic px-2"
        >
          Familiar processes, improved through dependable technology.
        </motion.p>
      </div>

      {/* Quote Section */}
      <div className="bg-white border-y border-gray-200 py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative min-h-[320px] sm:min-h-[280px] md:min-h-[260px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentQuoteIndex === index ? 1 : 0,
                  x: currentQuoteIndex === index ? 0 : -100,
                }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-2"
                style={{ pointerEvents: currentQuoteIndex === index ? 'auto' : 'none' }}
              >
                <svg className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[#1e3a8a] mx-auto mb-4 sm:mb-6 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed max-w-3xl">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-base sm:text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-sm sm:text-base text-gray-900">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8 sm:mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuoteIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentQuoteIndex === index ? 'bg-[#1e3a8a] w-8' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="bg-[#1e3a8a] py-12 sm:py-14 md:py-16"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            One Platform for Daily Academic Operations
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 md:mb-10">
            Simple. Memorable. Executive-friendly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
            <Link 
              to="/register" 
              id="register-button"
              className="inline-block bg-white text-[#1e3a8a] px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Register Your School
            </Link>
            <Link 
              to="/login" 
              id="login-button"
              className="inline-block bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold hover:bg-white hover:text-[#1e3a8a] transition-colors text-center"
            >
              Login to Portal
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default LandingPage;

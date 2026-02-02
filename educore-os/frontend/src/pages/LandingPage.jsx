import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BgImage from '../assets/BgImage.jpeg';

const LandingPage = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">EduCore OS</span>
              <span className="mt-1 ml-5 text-sm text-gray-500">Academic Management Platform</span>
            </div>
            <div className="flex gap-6">
              <Link to="/login" className="text-gray-700 mt-2 hover:text-gray-900 text-sm font-medium">School Login</Link>
              <Link to="/login/direct" className="bg-[#1e3a8a] text-white px-4 py-2 text-sm font-medium hover:bg-[#1e293b]">
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-white border-b border-gray-200 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.85), rgba(30, 41, 59, 0.85)), url(${BgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Academic Management Made Simple
            </h1>
            <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              EduCore is a centralized platform that helps schools manage academic records, 
              assessments, and internal examinations within one secure environment.
            </p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-block bg-white px-4 py-2 rounded border border-gray-300"
            >
              <span className="text-sm text-gray-600">Your School Portal: </span>
              <span className="text-sm font-mono text-[#1e3a8a] font-semibold">schoolname.educore.ng</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* What the System Handles */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 mb-8 text-center"
        >
          What the System Handles
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: 'Student Records & Class Structure',
              desc: 'Maintain complete student profiles, class assignments, and academic history in a structured digital format.'
            },
            {
              title: 'Continuous Assessments & Results',
              desc: 'Record scores, process results through approval workflows, and generate report cards with automated computation.'
            },
            {
              title: 'Computer-Based Internal Examinations',
              desc: 'Conduct structured internal exams with question banks, timed sessions, and automated marking.'
            },
            {
              title: 'Staff Access with Role-Based Permissions',
              desc: 'Secure access control for administrators, teachers, and department heads with appropriate permissions.'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideIn}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 p-6 hover:border-[#1e3a8a] transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideIn}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white border border-gray-200 p-6 md:col-span-2 hover:border-[#1e3a8a] transition-colors"
          >
            <h3 className="font-semibold text-gray-900 mb-3">Parent Visibility into Academic Progress</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Parents access results, download report cards, and track academic performance through secure portals.
            </p>
          </motion.div>
        </div>
      </div>

      {/* How Schools Get Started */}
      <div className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 mb-4 text-center"
          >
            Simple School Onboarding
          </motion.h2>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            EduCore is designed for easy adoption without disrupting existing school operations.
          </motion.p>
          
          <div className="grid md:grid-cols-4 gap-8">
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
                <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                  {step.num}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-gray-600 mt-12 italic"
          >
            A structured transition from manual processes to a reliable digital workflow.
          </motion.p>
        </div>
      </div>

      {/* Built for Everyday Use */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 mb-4 text-center"
        >
          Built Around Real School Workflows
        </motion.h2>
        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          EduCore supports the tasks schools already perform — now with greater speed, accuracy, and visibility.
        </motion.p>

        <div className="space-y-6">
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
              className="bg-white border border-gray-200 p-6 hover:border-[#1e3a8a] transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-gray-600 mt-12 italic"
        >
          Familiar processes, improved through dependable technology.
        </motion.p>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="bg-[#1e3a8a] py-12"
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-white mb-3">
            One Platform for Daily Academic Operations
          </h2>
          <p className="text-gray-300 mb-8">
            Simple. Memorable. Executive-friendly.
          </p>
          <button className="bg-white text-[#1e3a8a] px-6 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors">
            Request School Access
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">&copy; 2025 EduCore OS. Academic Management Platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

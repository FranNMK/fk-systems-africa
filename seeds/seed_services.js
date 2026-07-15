/*
 * seeds/seed_services.js - Populates the Services table with the provided catalogue.
 */

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('services').del()
    .then(function () {
      // Inserts seed entries grouped by category
      return knex('services').insert([
        // Software & Systems Development
        { category: 'Software & Systems Development', title: 'Software & Web Development', description: 'Custom web and mobile software tailored to your business needs.', display_order: 1 },
        { category: 'Software & Systems Development', title: 'Systems & Database Design', description: 'Scalable database architecture and systems integration.', display_order: 2 },
        { category: 'Software & Systems Development', title: 'UI/UX Design', description: 'User-centric interface design that drives engagement.', display_order: 3 },

        // AI & Intelligent Systems
        { category: 'AI & Intelligent Systems', title: 'AI Integrations into Existing Business Systems', description: 'Integrate cutting-edge AI into your current platforms.', display_order: 4 },
        { category: 'AI & Intelligent Systems', title: 'Chatbot & AI Assistant Development', description: 'Intelligent conversational agents for customer support.', display_order: 5 },
        { category: 'AI & Intelligent Systems', title: 'AI Strategy Consulting', description: 'Strategic roadmapping for AI adoption in your business.', display_order: 6 },
        { category: 'AI & Intelligent Systems', title: 'AI Literacy Programs', description: 'Foundational AI education for your teams.', display_order: 7 },
        { category: 'AI & Intelligent Systems', title: 'Training Employees on AI Literacy', description: 'Corporate workshops to upskill your workforce in AI.', display_order: 8 },

        // Cloud & Infrastructure
        { category: 'Cloud & Infrastructure', title: 'Cloud Deployment & DevOps', description: 'Reliable CI/CD pipelines and cloud infrastructure management.', display_order: 9 },
        { category: 'Cloud & Infrastructure', title: 'System Maintenance & Support Retainers', description: 'Ongoing technical support and system uptime monitoring.', display_order: 10 },

        // Consulting & Strategy
        { category: 'Consulting & Strategy', title: 'Technical Consulting', description: 'Expert advice on architecture, tech stack, and scaling.', display_order: 11 },
        { category: 'Consulting & Strategy', title: 'Digital Transformation Consulting', description: 'Guide your organization through digital modernization.', display_order: 12 },
        { category: 'Consulting & Strategy', title: 'MVP/Startup Technical Co-founding', description: 'Technical leadership and hands-on development for startups.', display_order: 13 },

        // Training & Education
        { category: 'Training & Education', title: 'Digital Skills Training', description: 'Hands-on training in coding and digital literacy.', display_order: 14 },
        { category: 'Training & Education', title: 'Bootcamps & Cohort-Based Courses', description: 'Immersive, intensive learning programs.', display_order: 15 },
        { category: 'Training & Education', title: 'School/Institution Curriculum Partnerships', description: 'Co-developed tech curriculum for educational institutions.', display_order: 16 },
        { category: 'Training & Education', title: 'Train-the-Trainer Programs', description: 'Empower your internal trainers to deliver digital skills education.', display_order: 17 },

        // Design & Brand
        { category: 'Design & Brand', title: 'Brand Identity & Digital Presence', description: 'Strategic branding and cohesive digital marketing.', display_order: 18 },

        // Specialized - Kenyan Market
        { category: 'Specialized — Kenyan Market', title: 'M-Pesa & Mobile Money Integration', description: 'Seamlessly integrate M-Pesa payment gateways into your app.', display_order: 19 },
        { category: 'Specialized — Kenyan Market', title: 'USSD Application Development', description: 'Build USSD applications for inclusive, offline-first user access.', display_order: 20 }
      ]);
    });
};
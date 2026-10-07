export interface Certification {
  id: string;
  title: string;
  issuer: string;
  category: 'networking' | 'ai' | 'ml';
  categoryLabel: string;
  issueDate: string;
  pdfUrl: string;
  imagePreviewUrl: string;
  accent: 'cyan' | 'violet' | 'emerald';
  description: string;
  skills: string[];
}

export const certificationsData: Certification[] = [
  {
    id: 'deeplearning-prob-stats',
    title: 'Probability & Statistics for Machine Learning',
    issuer: 'DeepLearning.AI',
    category: 'ai',
    categoryLabel: 'Artificial Intelligence & Math',
    issueDate: 'December 2024',
    pdfUrl: '/certifications/Coursera_Probability_ML_Certification.pdf',
    imagePreviewUrl: '/certifications/coursera-ml-certificate.png',
    accent: 'violet',
    description:
      'Rigorous mathematical foundation for modern AI systems covering probability distributions, statistical inference, hypothesis testing, and predictive modeling for data science.',
    skills: [
      'Probability Distributions',
      'Statistical Inference',
      'ML Mathematics',
      'Predictive Analytics',
      'Hypothesis Testing',
    ],
  },
  {
    id: 'datacamp-supervised-learning',
    title: 'Supervised Learning with scikit-learn',
    issuer: 'DataCamp',
    category: 'ml',
    categoryLabel: 'Applied Machine Learning',
    issueDate: 'November 2024',
    pdfUrl: '/certifications/Datacamp_supervised_learning_certificate.pdf',
    imagePreviewUrl: '/certifications/datacamp-ml-certificate.png',
    accent: 'emerald',
    description:
      'Hands-on machine learning model development in Python utilizing scikit-learn, covering classification, regression algorithms, model validation, and hyperparameter tuning.',
    skills: [
      'scikit-learn',
      'Classification & Regression',
      'Cross-Validation',
      'Model Optimization',
      'ROC-AUC Evaluation',
    ],
  },
  {
    id: 'cisco-ccnav7',
    title: 'CCNAv7: Introduction to Networks',
    issuer: 'Cisco Networking Academy',
    category: 'networking',
    categoryLabel: 'Networking & Infrastructure',
    issueDate: 'August 2021',
    pdfUrl: '/certifications/CCNAv7_Certification.pdf',
    imagePreviewUrl: '/certifications/ccna-certificate.png',
    accent: 'cyan',
    description:
      'Comprehensive networking credential covering enterprise router and switch configuration, IPv4/IPv6 subnetting, OSI layering, network security best practices, and diagnostic troubleshooting.',
    skills: [
      'Switch & Router Config',
      'IPv4 / IPv6 Subnetting',
      'Network Security',
      'OSI Model',
      'Troubleshooting',
    ],
  },
];

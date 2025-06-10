export interface HomepageHeroSection {
  title: string;
  subtitle: string;
  cta: string;
  badge: string;
}

export interface HomepageStat {
  number: number;
  text: string;
}

export interface HomepageFeature {
  title: string;
  description: string;
  icon?: React.ReactNode; // Icons will be rendered client-side
}

export interface HomepageConcept {
  title: string;
  description: string;
  icon?: React.ReactNode; // Icons will be rendered client-side
}

export interface HomepageTestimonial {
  name: string;
  comment: string;
}

export interface HomepageTools {
  title: string;
  description: string;
  toolsList: string[];
}

export interface HomepageNewsSection {
  title: string;
  description: string;
}

export interface HomepageFooter {
  brand: string;
  links: string[];
  copyright: string;
}

export interface HomepageData {
  heroSection: HomepageHeroSection;
  stats: HomepageStat[];
  features: HomepageFeature[];
  concepts: HomepageConcept[];
  testimonials: HomepageTestimonial[];
  tools: HomepageTools;
  newsSection: HomepageNewsSection;
  footer: HomepageFooter;
}

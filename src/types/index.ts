// Common Types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

// Form Types
export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon?: string;
  image?: string;
}

// Consulting Process Step Types
export interface ConsultingStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

// Service Category Types
export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  services: ServiceItem[];
  icon: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

// Consulting Form Types
export interface ConsultingForm {
  companyName: string;
  location: string;
  scale: string;
  services: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  additionalRequests?: string;
}

// Company Information Types
export interface CompanyInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  businessNumber: string;
  ceo: string;
  established: string;
}

// Contact Types
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject: string;
  message: string;
  serviceType?: string;
}

// Portfolio Types
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  location: string;
  completedAt: string;
  services: string[];
  results?: {
    metric: string;
    value: string;
    improvement?: string;
  }[];
}

// Board Types
export interface BoardPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  views: number;
  tags?: string[];
  
  // 고객 후기 전용 필드
  clientName?: string;
  clientCompany?: string;
  clientPosition?: string;
  rating?: number;
}

export interface BoardCategory {
  id: string;
  name: string;
  description?: string;
  postCount: number;
}

export interface SearchParams {
  query?: string;
  category?: string;
  page?: number;
  sortBy?: 'date' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Partner Types
export interface Partner {
  id: string;
  name: string;
  image_url: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

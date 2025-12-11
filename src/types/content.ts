import { BaseEntity } from './common';

export interface BlogPost extends BaseEntity {
  title: string;
  content: string;
  category: string;
  tags: string[];
  authorId: string;
  publishedAt: Date;
  isPublished: boolean;
  featuredImage?: string;
}

export interface Testimonial extends BaseEntity {
  patientId: string;
  rating: number; // 1-5
  comment: string;
  isApproved: boolean;
}
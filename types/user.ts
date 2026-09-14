export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface CreatorDashboardStats {
  totalSurprises: number;
  publishedSurprises: number;
  totalViews: number;
  reactionsReceived: number;
}

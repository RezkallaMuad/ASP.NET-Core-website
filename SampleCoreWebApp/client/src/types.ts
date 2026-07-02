export interface ProjectMedia {
  type: "image" | "video";
  url: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string;
  gitHubUrl: string;
  imageUrl?: string;
  media?: ProjectMedia[];
  contributors?: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  displayOrder: number;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description?: string;
  displayOrder: number;
}

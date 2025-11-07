export interface ICourseCategory {
  id: string;
  name: string;
  courses?: ICourse[];
  isDeleted: boolean;
}

export interface ICourse {
 
  title: string;
  description: string;
  thumbnail: string;
  overviewUrl: string;
  price: number;
  isFree: boolean;
  categoryId: string;
  authorId: string;
  category?: ICourseCategory;
  Videos?: IVideo[];
  reviews?: IReview[];
  progresses?: ICourseProgress[];
  tags: string[];
  features: string[];
  overviews: string[];
  stack: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVideo {
  id: string;
  title: string;
  duration: number;
  url: string;
  courseId: string;
  course?: ICourse;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface IReview {
  id: string;
  courseId: string;
  userId: string;
  ratings: number;
  comment: string;
  createdAt: Date;
  course?: ICourse;
  isDeleted: boolean;
}

export interface ICourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  lastAccessedAt: Date;
  course?: ICourse;
  createdAt: Date;
  updatedAt: Date;
}


export interface MulterFiles {
  thumbnail?: Express.Multer.File[];
  overviewUrl?: Express.Multer.File[];
}

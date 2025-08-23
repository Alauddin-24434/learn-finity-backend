// interfaces/course.interface.ts
export interface ICourse {
  title: string;
  description: string;
  thumbnail: string;
  thumbnailPublicId: string;
  overviewVideo: string;
  overviewVideoPublicId: string;

  price: number;
  isFree: boolean;
  authorId: string;
  categoryId: string;
  features: string[];
  overviews: string[];
  stack: string[];


}

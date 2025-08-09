// interfaces/course.interface.ts
export interface ICourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  authorId: string;
  categoryId: string;
 
  createdAt: string;
  updatedAt: string;
    features: string[];
    overviews: string[];
    stack: string[];
    

}

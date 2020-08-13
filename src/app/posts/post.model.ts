export interface Post{
  id: string;
  userId : string,
  title: string;
  content: string;
  likesCount : Number,
  liked : [],
  imagePath: string;
}

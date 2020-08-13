export interface Post {
  id: string;
  _userId: string;
  title: string;
  content: string;
  likesCount: Number;
  liked: [];
  imagePath: string;
}

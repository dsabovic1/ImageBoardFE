import { Comment } from './comment.model'

export interface Post{
  id: string;
  userId : string,
  title: string;
  content: string;
  likesCount : Number,
  liked : [],
  comments : { comms: Comment[], isCollapsed : boolean },
  imagePath: string;
}

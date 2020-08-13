import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts: Post [] = [];
  private postsUpdated = new Subject <Post []>();

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute){}
  getPosts (){
    this.http.get<{message:string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      return postData.posts.map(post=> {
        return {
          title: post.title,
          userId: post.userId,
          content: post.content,
          id: post._id,
          likesCount: post.likesCount,
          liked: post.liked,
          comments : post.comments,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe((transformedPosts)=>{
      this.posts=transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  addComment(newComment, postId, callbackF, ovo) : any {
    const postData = {
      postId : postId,
      username : "tito1111",
      text : newComment
  };
    return this.http.post(
      'http://localhost:3000/api/posts/addComment', postData).subscribe((responseData : any) =>{
      callbackF(responseData, ovo);
    });
  }

  updatePost(id: string, title:string, content: string){
    const post={
      id: id,
      title: title,
      content: content,
      imagePath: null
    };
    this.http.
    put("http://localhost:3000/api/posts/" + id, post)
    .subscribe(response => {
      const updatedPosts=[...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p=>p.id ===post.id);
      updatedPosts[oldPostIndex].title=post.title;
      updatedPosts[oldPostIndex].content=post.content;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"],{relativeTo: this.route});
    });
  }

  addPost(title: string, content: string, image: File){

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);


    this.http.post<{message: string, post: Post}>(
      'http://localhost:3000/api/posts',postData)
    .subscribe((responseData)=>{
      const post: Post = {
        id: responseData.post.id,
        userId : "5",
        title: title,
        content: content,
        likesCount : 0,
        liked : [],
        comments : {comms : [], isCollapsed : true},
        imagePath: responseData.post.imagePath};
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });

  }
  getPost(id: string){
    return this.http.get<{_id: string, userId: string, title: string, content: string, likesCount: Number, liked : [], comments: {comms: [], isCollapsed : boolean}}>("http://localhost:3000/api/posts/" + id);
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(()=>{
      const updatedPosts = this.posts.filter(post => post.id!==postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

    onLike(postId, userId, funkcija, ovo) {
    const postData = {
      postId: postId,
      userId: userId
    };
    this.http.post(
      'http://localhost:3000/api/posts/like', postData).subscribe((responseData : any) =>{
      funkcija(responseData, ovo);
    });

  }

}

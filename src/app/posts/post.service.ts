import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  getPostsFromUser(id: string) {
    console.log('http://localhost:3000/api/posts/user/' + id);
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts/user/' + id
      )
      .pipe(
        map((postData) => {
          console.log(postData);
          return postData.posts.map((post) => {
            console.log(post);
            return {
              title: post.title,
              _userId: post._userId,
              content: post.content,
              id: post._id,
              likesCount: post.likesCount,
              liked: post.liked,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        console.log(transformedPosts);
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          console.log(postData);
          return postData.posts.map((post) => {
            return {
              userId: post.userId,
              content: post.content,
              id: post._id,
              likesCount: post.likesCount,
              liked: post.liked,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePost(id: string,  content: string) {
    const post = {
      id: id,
      content: content,
      imagePath: null,
    };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
       
        updatedPosts[oldPostIndex].content = post.content;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'], { relativeTo: this.route });
      });
  }

  addPost( content: string, image: File) {
    const postData = new FormData();
    
    postData.append('content', content);
    postData.append('image', image, );
    postData.append('_userId', this.authService.getUserId());

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          userId: '3',
          content: content,
          likesCount: 0,
          liked: [],
          imagePath: responseData.post.imagePath,
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      userId: string;
      title: string;
      content: string;
      likesCount: Number;
      liked: [];
    }>('http://localhost:3000/api/posts/' + id);
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  onLike(postId, userId, funkcija, ovo) {
    const postData = {
      postId: postId,
      userId: userId,
    };
    this.http
      .post('http://localhost:3000/api/posts/like', postData)
      .subscribe((responseData: any) => {
        funkcija(responseData, ovo);
      });
  }
}

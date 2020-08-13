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
    console.log('tu');
    this.http
      .get<{ message: string; posts: any }>(
        'http://localhost:3000/api/posts/user' + id
      )
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
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
          return postData.posts.map((post) => {
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

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePost(id: string, title: string, content: string) {
    const post = {
      id: id,
      title: title,
      content: content,
      imagePath: null,
    };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex].title = post.title;
        updatedPosts[oldPostIndex].content = post.content;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'], { relativeTo: this.route });
      });
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('_userId', this.authService.getUserId());

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          _userId: this.authService.getUserId(),
          title: title,
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
      _userId: string;
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
    console.log('userid' + userId);
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

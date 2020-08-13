import { Component, OnInit } from '@angular/core';
import { Post } from '../../posts/post.model';
import { PostsService } from '../../posts/post.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  isLoggedIn = this.authService.isLoggedIn();
  isLoading = false;
  posts: Post[] = [];
  username = this.authService.getUsername();
  public userId = this.authService.getUserId();
  private postsSub: Subscription;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPostsFromUser(this.authService.getUserId());
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  onLike(postId, userId) {
    this.postsService.onLike(postId, userId, this.callbackF, this);
  }

  callbackF(responseData: any, ovo) {
    for (let i = 0; i < ovo.posts.length; i++) {
      if (ovo.posts[i].id === responseData.postId) {
        if (ovo.posts[i].likesCount < responseData.newLikeCount) {
          ovo.posts[i].liked.push(ovo.userId);
        } else {
          const index = ovo.posts[i].liked.indexOf(ovo.userId);
          if (index > -1) {
            ovo.posts[i].liked.splice(index, 1);
          }
        }
        ovo.posts[i].likesCount = responseData.newLikeCount;
      }
    }
    console.log(ovo.posts);
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

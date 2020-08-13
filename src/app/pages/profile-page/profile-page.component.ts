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
        this.posts = posts.reverse();
        this.isLoading = false;
      });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postsService: PostsService) {}
  isLoading = false;
  posts: Post[] = [];
  private postsSub: Subscription;
  ngOnInit(): void {
    //this.posts = this.postsService.getPosts();

    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }
  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  //   posts= [
  //     { title: 'First Post', content:'This is the first post' },
  //     { title: 'Second Post', content:'This is the second post' },
  //     { title: 'Third Post', content:'This is the thirs post' },

  // ];
  //kad imamo input
  //@Input() posts: Post[]=[]; //da mozemo primati podatke izvan, to jeste iz app.html odakle se poziva komponenta
}

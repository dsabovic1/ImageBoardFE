import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-edi',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}
  isLoggedIn = this.authService.isLoggedIn();
  private mode = 'create';
  private postId: string;
  isLoading = false;
  form: FormGroup;
  post: Post;

  ngOnInit(): void {
    this.form = new FormGroup({
      content: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            userId: postData.userId,
            title: postData.title,
            content: postData.content,
            likesCount: postData.likesCount,
            liked: postData.liked,
            imagePath: null,
          };
          this.form.setValue({
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  enteredContent = '';
  enteredTitle = '';

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

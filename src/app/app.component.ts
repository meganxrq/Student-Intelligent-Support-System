import {Component} from '@angular/core';
import {UserService} from './services/user.service';
import {SnackBarService} from './services/snack-bar.service';
import {User} from './models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'University';

  constructor(
    private userService: UserService,
    private notification: SnackBarService,
    private router: Router
  ) {
    if (this.userService.isSignedIn()) {
      this.userService.auth().subscribe(
        (authUser: User) => {
          this.userService.setMe(authUser);
        },
        error => {
          router.navigateByUrl('/sign-in');
          this.notification.open('Could not authenticate');
        }
      );
    }
  }

}

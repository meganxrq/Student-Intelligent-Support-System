import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {SnackBarService} from '../../services/snack-bar.service';
import {UserService} from '../../services/user.service';
import {ServerResponse} from '../../constants/const';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {MatRadioChange} from "@angular/material/radio";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less']
})
export class SignInComponent implements OnInit {

  formGroup: FormGroup;

  isClicked: boolean;

  radioChoice: number;

  constructor(
    private snackBar: SnackBarService,
    private userService: UserService,
    private router: Router) {

    this.isClicked = false;

    this.formGroup = new FormGroup({
        loginF: new FormControl(''),
        passwordF: new FormControl('')
      }
    );
  }

  ngOnInit() {
    if (this.userService.isSignedIn()) {
      this.redirect();
    }
  }

  getLoginErrorMessage() {
    return this.formGroup.get('loginF').hasError('pattern') ? 'The login is incorrect' :
      '';
  }

  getPasswordErrorMessage() {
    return this.formGroup.get('loginF').hasError('pattern') ? 'The password is incorrect' :
      '';
  }

  isDisabled(): boolean {
    return this.isClicked
      || !this.formGroup.get('loginF').value.toString().replace(/\s/g, '')
      || !this.formGroup.get('passwordF').value.toString().replace(/\s/g, '')
      || !this.formGroup.valid;
  }

  submit() {
    if (!this.isDisabled()) {
      this.isClicked = true;
      const login = this.formGroup.get('loginF').value.toString().replace(/\s/g, '');
      const password = this.formGroup.get('passwordF').value.toString().replace(/\s/g, '');
      this.signIn(login, password);
    }
  }

  signIn(login: string, password: string) {
    this.userService.getUser(login, password).subscribe(
      (user: User) => {
        localStorage.setItem('token', localStorage.getItem('tempToken'));
        this.userService.setMe(user);
        this.snackBar.open('Welcome, ' + this.userService.getBeautyName() + '!');
        this.redirect();
        this.isClicked = false;
      },
      error => {
        if (error.status === 401) {
          this.snackBar.open('Your either login or password are wrong!');
        } else {
          this.snackBar.open(ServerResponse.NO_RESPONSE);
        }
        this.isClicked = false;
      }
    );
  }

  redirect() {
    if (this.userService.isAdmin()) {
      this.router.navigateByUrl('/admin');
    } else if (this.userService.isStudent() || this.userService.isProfessor()) {
      this.router.navigateByUrl('/progress');
    } else {
      setTimeout(() => {
        this.redirect();
      }, 1000);

    }
  }

  demoRadioChanged(event: MatRadioChange): void {
    switch (event.value) {
      case 'admin':
        this.formGroup.patchValue({loginF: 'Admin', passwordF: 'Admin'});
        break;

      case 'professor':
        this.formGroup.patchValue({loginF: 'p84745151589', passwordF: '439000365'});
        break;

      case 'student':
        this.formGroup.patchValue({loginF: 's804222077', passwordF: '580083160'});
        break;
    }
  }

}

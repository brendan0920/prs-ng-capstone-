import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  // SystemService will be shared across one user's session in our application.
  // The main function of this service is to store the loggedIn-User.

  loggedInUser: User = new User();

  constructor(private router: Router) { }

  checkLogin(): void {
    // check loggedInUser, if not logged in, forward to Login page
    // only call this method when ready for primtime
    if (this.loggedInUser.id == 0) {
      console.log("User is not authenticated. Redirecting to Login.");
      this.router.navigateByUrl("/user-login");
    }
  }
}

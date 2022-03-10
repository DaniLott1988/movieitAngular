import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birth_date: '' }

  UserFromStorage: any = localStorage.getItem('user');
  currentUser: any = (JSON.parse(this.UserFromStorage));
  currentUsername: any = this.currentUser.Username;
  currentFavs: any = this.currentUser.Favorites;
  favsEmpty: boolean = true;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentUser(this.currentUsername);
  }

  mainPage(): void {
    this.router.navigate(['movies']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

  getCurrentUser(currentUser: string): void {
    this.fetchApiData.getUser(currentUser).subscribe((resp: any) => {
      this.currentUser = resp;
      this.currentFavs = this.currentUser.Favorites;
      this.areFavsEmpty();
      return this.currentUser;
    });
  }

  areFavsEmpty(): any {
    if (this.currentFavs.length == 0) {
      this.favsEmpty = true;
    } else {
      this.favsEmpty = false;
    }
    return this.favsEmpty;
  }

  removeFromFavs(movieId: string): void {
    this.fetchApiData.deleteFavMovie(this.currentUsername, movieId).subscribe((resp: any) => {
      this.ngOnInit();
      this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
    });
    this.ngOnInit();
  }

  editUserInfo(): void {
    const updatedData = {
      Username: this.userData.Username ? this.userData.Username : this.currentUser.Username,
      Password: this.userData.Password ? this.userData.Password : this.currentUser.Password,
      Email: this.userData.Email ? this.userData.Email : this.currentUser.Email,
      Birth_date: this.userData.Birth_date ? this.userData.Birth_date : this.currentUser.Birth_date,
    }

    this.fetchApiData.editUser(updatedData).subscribe((resp: any) => {
      this.snackBar.open("Profile updated", "OK", {
        duration: 4000
      });
      localStorage.setItem('user', resp.Username)
      this.getCurrentUser(this.currentUser.Username)
    }, (resp: any) => {
      this.snackBar.open("Failed to update", "OK", {
        duration: 4000
      });
    })
  }
}

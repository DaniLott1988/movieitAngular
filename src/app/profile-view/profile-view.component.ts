import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})

export class ProfileViewComponent implements OnInit {

  movies: any[] = [];
  Favorite_Movies: any[] = [];
  UserFromStorage: any = localStorage.getItem('user');
  currentUser: any = (JSON.parse(this.UserFromStorage));
  currentUsername: any = this.currentUser.Username;
  currentFavs: any = this.currentUser.Favorite_Movies;
  username: any = localStorage.getItem('user');
  user: any = JSON.parse(this.username);
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
      this.currentFavs = this.currentUser.Favorite_Movies;
      this.areFavsEmpty();
      return this.currentUser;
    });
  }

  EditUser(
    username: string,
    password: string,
    email: string,
    birth_date: Date
  ): void {
    this.dialog.open(EditUserComponent, {
      data: { username, password, email, birth_date },
      width: '320px'
    });
  }

  deleteUser(): void {
    this.dialog.open(DeleteUserComponent, {
      width: '320px'
    });
  }

  removeFromFavs(movieId: string): void {
    this.fetchApiData.deleteFavMovie(this.user.Username, movieId).subscribe((resp: any) => {
      this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
      this.getCurrentUser(this.user.Username);
      this.ngOnInit();
      2000
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

}

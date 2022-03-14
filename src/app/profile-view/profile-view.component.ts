/**
 * Renders a form for users to update their account information and 
 * an array of movie cards corresponding to their favorite movies.  
 * 
 * Also renders a BannerComponent.
 * 
 * @module ProfileViewComponent
 */

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

  /**
   * Grabs the user information from the database on the backend 
   */

  movies: any[] = [];
  UserFromStorage: any = localStorage.getItem('user');
  currentUser: any = (JSON.parse(this.UserFromStorage));
  currentUsername: any = this.currentUser.Username;
  currentFavs: any = this.currentUser.Favorite_Movies;
  favsEmpty: boolean = true;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) { }

  /**
   * Fetches data for the logged in user.  
   * Then, downloads all the movie data and maps
   * the user's favs to Favorite_Movies.  
   */

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

  /**
   * What pulls up when a user logs in and accesses their current info
   */

  getCurrentUser(currentUser: string): void {
    this.fetchApiData.getUser(currentUser).subscribe((resp: any) => {
      this.currentUser = resp;
      this.currentFavs = this.currentUser.Favorite_Movies;
      this.getMovies();
      this.areFavsEmpty();
      return this.currentUser;
    });
  }

  /**
   * Fetches the logged in user's favorite movies from the server.  
   * This function is called from [[ProfileViewComponent.getCurrentUser]].
   */

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp.filter( (movie: any) => 
      this.currentFavs.includes(movie._id));
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

  /**
   * How a user deletes a movie from the list of Favorite_Movies.
   */

  removeFromFavs(movieId: string): void {
    this.fetchApiData.deleteFavMovie(this.currentUsername, movieId).subscribe((resp: any) => {
      this.ngOnInit();
      this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
    });
    this.ngOnInit();
  }

  /**
   * What doesn't show when a user doesn't have favorite movies yet
  */

  areFavsEmpty(): any {
    if (this.currentFavs.length == 0) {
      this.favsEmpty = true;
    } else {
      this.favsEmpty = false;
    }
    return this.favsEmpty;
  }

}

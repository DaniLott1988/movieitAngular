/**
 * Renders a responsive grid of movie cards for each movie in the database.  
 * Each movie card has an image, links to open dialogs for genre, director, and description 
 * components, and a toggle button to add or remove the movie from the user's favorites.  
 *   
 * Also renders a BannerComponent.
 * 
 * @module MovieCardComponent
 */

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MovieDetailsViewComponent } from '../movie-details-view/movie-details-view.component';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { GenreViewComponent } from '../genre-view/genre-view.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  movies: any[] = [];
  Favorite_Movies: any[] = [];
  username: any = localStorage.getItem('user');
  user: any = JSON.parse(this.username);
  currentUser: any = null;
  currentFavs: any = null;
  isInFavs: boolean = false;


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    ) { }

  ngOnInit(): void {
    this.getMovies()
    this.getCurrentUser(this.user.Username);
  }

  getCurrentUser(username: string): void {
    this.fetchApiData.getUser(username).subscribe((resp: any) => {
      this.currentUser = resp;
      this.currentFavs = resp.Favorite_Movies;
      return (this.currentUser, this.currentFavs);
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * 
   * @param movie {Title: <string>, Description: <string>, ... }  
   * Opens a dialog box with a MovieDetailsComponent, passing the movie data
   * into the component.
   */

  openMovieDetailsView(title: string, description: string): void {
    this.dialog.open(MovieDetailsViewComponent, {
      data: { Title: title, Description: description },
      width: '300px',
    });
  }

   /**
   * 
   * @param genre {Name: <string>, Description: <string>}  
   * Opens a dialog box with a GenreViewComponent, passing the genre data
   * into the component.
   */

  openGenreView(name: string, description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: { Name: name, Description: description },
      width: '300px',
    })
  }

  /**
   * @param director {Name: <string>, Bio: <string>, Birth: <string>, Death: <string>}  
   * Opens a dialog box with a DirectorViewComponent, passing the director 
   * data into the component.
   */

  openDirectorView(name: string, bio: string, birth: string, death: string): void {
    this.dialog.open(DirectorViewComponent, {
      data: { Name:name, Bio: bio, Birth: birth, Death: death },
      width: '300px',
    })
  }

  /**
   * @param id string containing the ID of a movie to be added to the user's 
   * list of favorite movies.  
   * 
   * Adds a movie to a user's list of favorites with a POST request via 
   * [[FetchApiDataService.addFavoriteMovie]].
   */

  addToFavs(movieId: string): void {
    //checking if the title is already in favs
    if (this.currentFavs.filter(function (e: any) { return e._id === movieId; }).length > 0) {
      this.snackBar.open('Already in your favs', 'OK', { duration: 2000 });
      return
    } else {
      this.fetchApiData.addFavoriteMovie(this.user.Username, movieId).subscribe((resp: any) => {
        this.getCurrentUser(this.user.Username);
        this.ngOnInit();
        this.snackBar.open('Added to favs', 'OK', { duration: 2000 });
      });
    }
  }

  /**
   * @param id string containing the ID of a movie to be removed from the user's
   * list of favorite movies.
   * 
   * Removes a movie from a user's list of favorites with a DELETE request via
   * [[FetchApiDataService.deleteFavMovie]].
   */

  removeFromFavs(movieId: string): void {
    this.fetchApiData.deleteFavMovie(this.user.Username, movieId).subscribe((resp: any) => {
      this.snackBar.open('Removed from favs', 'OK', { duration: 2000 });
      this.getCurrentUser(this.user.Username);
      this.ngOnInit();
      2000
    });
  }

  favCheck(movieId: string): any {
    let favIds = this.currentFavs.map(function (fav: any) { return fav._id });
    if (favIds.includes(movieId)) {
      this.isInFavs = true;
      return this.isInFavs;
    };
  }

  /**
   * Sets the isFavorite attribute of each movie to true or false.  
   * This is called after fetching the favorites with
   * [[MovieCardComponent.favCheck]].
   */

  toggleFavs(movieId: string): void {
    if (this.currentFavs.filter(function (e: any) { return e._id === movieId; }).length > 0) {
      this.removeFromFavs(movieId);
      this.isInFavs = false;
    } else {
      this.addToFavs(movieId)
      this.isInFavs = true;
    }
  }

  openProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

}
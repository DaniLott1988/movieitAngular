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
  Favorites: any[] = [];
  user: any[] = [];


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    ) { }

  ngOnInit(): void {
    this.getMovies()
    this.getFavoriteMovies()
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getFavoriteMovies(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.Favorites = resp.FavoriteMovies;
      console.log(this.Favorites);
    });
  }

  openMovieDetailsView(Title: string, Description: string): void {
    this.dialog.open(MovieDetailsViewComponent, {
      data: { Title, Description }
    })
  }

  openGenreView(Name: string, Description: string): void {
    this.dialog.open(GenreViewComponent, {
      data: { Name, Description }
    })
  }

  openDirectorView(Name: string, Bio: string, Birth: string, Death: string): void {
    this.dialog.open(DirectorViewComponent, {
      data: { Name, Bio, Birth, Death }
    })
  }

  addFavoriteMovie(MovieID: string, title: string): void {
    this.fetchApiData.addFavoriteMovie(MovieID, this.user).subscribe((resp: any) => {
      this.snackBar.open(`${title} has been added to your Watchlist!`, 'OK', {
        duration: 4000,
      });
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  removeFavoriteMovie(MovieId: string, title: string): void {
    this.fetchApiData.deleteFavMovie(MovieId, this.user).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(
        `${title} has been removed from your Watchlist!`,
          'OK',
          {
            duration: 4000,
          }
        );
      this.ngOnInit();
    });
    return this.getFavoriteMovies();
  }

  isFavorite(MovieID: string): boolean {
    return this.Favorites.some((movie) => movie._id === MovieID);
  }

  toggleFavorite(movie: any): void {
    this.isFavorite(movie._id)
      ? this.removeFavoriteMovie(movie._id, movie.Title)
      : this.addFavoriteMovie(movie._id, movie.Title);
  }

  openProfile(): void {
    this.router.navigate(['profile']);
  }

  logOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }

}

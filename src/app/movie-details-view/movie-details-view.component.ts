/**
 * The Movie Details component is used to display the discription of a movie in a dialog
 * box when the user clicks the 'Movie Details' button on a movie card.
 * 
 * @module MovieDetailsViewComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-details-view',
  templateUrl: './movie-details-view.component.html',
  styleUrls: ['./movie-details-view.component.scss']
})
export class MovieDetailsViewComponent implements OnInit {

  /**
   * 
   * @param data An object containing movie data. Must have Title and Description parameters 
   * both containing strings.
   * 
   */

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string,
      Description: string
    }
  ) { }

  ngOnInit(): void {
  }

}

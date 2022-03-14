/**
 * The Genre component displays data about a genre and is implemented 
 * when clicking on the "Genre" button on a movie card.
 * 
 * @module GenreViewComponent
 */

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre-view',
  templateUrl: './genre-view.component.html',
  styleUrls: ['./genre-view.component.scss']
})
export class GenreViewComponent implements OnInit {

  /**
   * 
   * @param data An object containing Genre data. Must have Name and Description 
   * properties (all strings)
   */

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Name: string,
      Description: string
    }
  ) { }

  ngOnInit(): void {
  }

}

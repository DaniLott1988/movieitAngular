/**
 * Renders a registration form for users to make a new account.  
 * The user must supply a valid Username, Password, Email, and 
 * Birth_date.
 * 
 * @module UserRegistrationFormComponent
 */

import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  /**
   * The input userData is empty strings by default.
   * This is updated when the suer types into the form fields.
   */

  @Input() userData = { Username: '', Password: '', Email: '', Birth_date: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Attempts to register the user with the input credentials.  
   * Upon sucessful registration, the user can then log in.
  */
  
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {

      this.dialogRef.close();
      
      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    }, (result) => {

      this.snackBar.open(result, 'OK', {
        duration: 2000
      });
    });
  }
}

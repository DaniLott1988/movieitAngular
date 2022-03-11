import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit {

  Username = localStorage.getItem('user');
  user: any = {};

  @Input() userProfile = {
    Username: this.user.Username,
    Password: this.user.Password,
    Email: this.user.Email,
    Birth_date: this.user.Birth_date,
  };


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    public snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  getUser(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.user = resp;
    });
  }

  editUser(): void {
    this.fetchApiData
      .editUser(this.userProfile)
      .subscribe((resp) => {
        this.dialogRef.close();

        // update profile in localstorage
        localStorage.setItem('Username', this.userProfile.Username);
        localStorage.setItem('Password', this.userProfile.Password);

        this.snackbar.open('Your profile was updated successfully!', 'OK', {
          duration: 4000,
        });
        setTimeout(() => {
          window.location.reload();
        });
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})

export class DeleteUserComponent implements OnInit {

  UserFromStorage: any = localStorage.getItem('user');
  currentUser: any = (JSON.parse(this.UserFromStorage));
  username: string = this.currentUser.Username;

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  deleteUser(): void {
    this.fetchApiData.deleteUser(this.username!).subscribe((response) => {
      console.log('response', response);
      console.log('removing user:', this.username);
      this.snackbar.open('Your account has been removed', 'Bye', { duration: 2000 });
      this.dialogRef.close();
      localStorage.clear();
      this.router.navigate(['welcome'])
    });
  }
}

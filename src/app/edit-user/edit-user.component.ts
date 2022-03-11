import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})

export class EditUserComponent implements OnInit {

  @Input() newData = { Username: '', Password: '', Name: '', Email: '', Birth_date: '' }

  userData: any = {
    Username: this.data.username,
    Password: this.data.password,
    Email: this.data.email,
    Birth_date: this.data.birth_date
  };


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<EditUserComponent>,
    public snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      username: string;
      password: string;
      email: string;
      birth_date: Date;
    }
  ) { }

  ngOnInit(): void {
  }

  editUser(): void {
    if (this.newData.Username && this.newData.Password && this.newData.Email && this.newData.Birth_date) {
      this.fetchApiData.editUser(this.data.username, this.newData).subscribe((resp: any) => {
        this.dialogRef.close();
        window.location.reload();
        localStorage.setItem('user', JSON.stringify(resp));
        this.snackbar.open('Data successfully updated', 'OK', { duration: 2000 })
      });
      //alert when submitting an empty field
    } else {
      this.snackbar.open('Plase fill all the fields', 'OK', { duration: 2000 })
    }
  }

}

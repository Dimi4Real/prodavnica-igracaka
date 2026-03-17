import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReservationModel } from '../../../models/reservation.model';

@Component({
  selector: 'app-edit-reservation-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './edit-reservation-dialog.html',
  styleUrl: './edit-reservation-dialog.css'
})
export class EditReservationDialog {
  editData: Partial<ReservationModel>

  constructor(
    public dialogRef: MatDialogRef<EditReservationDialog>,
    @Inject(MAT_DIALOG_DATA) public reservation: ReservationModel
  ) {
    this.editData = {
      toyName: reservation.toyName,
      toyPrice: reservation.toyPrice
    }
  }

  doSave() {
    this.dialogRef.close(this.editData)
  }

  doCancel() {
    this.dialogRef.close(null)
  }
}
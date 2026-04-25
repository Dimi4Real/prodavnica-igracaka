import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ReservationModel } from '../../../models/reservation.model';

@Component({
  selector: 'app-edit-reservation-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './edit-reservation-dialog.html',
  styleUrl: './edit-reservation-dialog.css'
})
export class EditReservationDialog {
  editData: Partial<ReservationModel>

  targetGroups = ['svi', 'dečak', 'devojčica']

  constructor(
    public dialogRef: MatDialogRef<EditReservationDialog>,
    @Inject(MAT_DIALOG_DATA) public reservation: ReservationModel
  ) {
    this.editData = {
      toyName: reservation.toyName,
      toyDescription: reservation.toyDescription,
      toyType: reservation.toyType,
      toyAgeGroup: reservation.toyAgeGroup,
      toyTargetGroup: reservation.toyTargetGroup,
      toyProductionDate: reservation.toyProductionDate,
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
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReservationModel } from '../../../models/reservation.model';

@Component({
  selector: 'app-rate-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './rate-dialog.html',
  styleUrl: './rate-dialog.css'
})
export class RateDialog {
  rating: number = 0
  comment: string = ''

  constructor(
    public dialogRef: MatDialogRef<RateDialog>,
    @Inject(MAT_DIALOG_DATA) public reservation: ReservationModel
  ) {
    this.rating = reservation.rating ?? 0
    this.comment = reservation.reviewComment ?? ''
  }

  setRating(star: number) {
    this.rating = star
  }

  getStars(): number[] {
    return [1, 2, 3, 4, 5]
  }

  doSave() {
    if (this.rating === 0) return
    this.dialogRef.close({ rating: this.rating, comment: this.comment })
  }

  doCancel() {
    this.dialogRef.close(null)
  }
}
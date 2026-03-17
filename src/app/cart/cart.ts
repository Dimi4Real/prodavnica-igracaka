import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ReservationModel } from '../../models/reservation.model';
import { Alerts } from '../alerts';
import { EditReservationDialog } from './edit-reservation-dialog/edit-reservation-dialog';
import { RateDialog } from './rate-dialog/rate-dialog';

@Component({
  selector: 'app-cart',
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  clientWidth: number = document.documentElement.clientWidth
  displayedColumns: string[] = []

  constructor(public router: Router, private dialog: MatDialog) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
      return
    }
    this.resizeTable()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.clientWidth = (event.target as Window).document.documentElement.clientWidth
    this.resizeTable()
  }

  resizeTable() {
    if (this.clientWidth >= 900) {
      this.displayedColumns = ['naziv', 'cena', 'status', 'kreirano', 'akcije']
      return
    }
    if (this.clientWidth >= 600) {
      this.displayedColumns = ['naziv', 'cena', 'status', 'akcije']
      return
    }
    this.displayedColumns = ['naziv', 'akcije']
  }

  reloadComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/cart']))
  }

  getRezervisano(): ReservationModel[] {
    return AuthService.getReservations().filter(r => r.status === 'rezervisano')
  }

  getPristiglo(): ReservationModel[] {
    return AuthService.getReservations().filter(r => r.status === 'pristiglo')
  }

  getOtkazano(): ReservationModel[] {
    return AuthService.getReservations().filter(r => r.status === 'otkazano')
  }

  getTotalPrice(): number {
    return this.getRezervisano().reduce((sum, r) => sum + r.toyPrice, 0)
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  doDelete(reservation: ReservationModel) {
    Alerts.confirm(`Da li želite da obrišete igračku "${reservation.toyName}" iz korpe?`, () => {
      AuthService.deleteReservation(reservation.toyId, reservation.status)
      this.reloadComponent()
    })
  }

  doEdit(reservation: ReservationModel) {
    const dialogRef = this.dialog.open(EditReservationDialog, {
      width: '400px',
      data: reservation
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        AuthService.updateReservation(reservation.toyId, result)
        Alerts.success('Rezervacija je uspešno izmenjena!')
        this.reloadComponent()
      }
    })
  }

  doRate(reservation: ReservationModel) {
    const dialogRef = this.dialog.open(RateDialog, {
        width: '400px',
        data: reservation
    })

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            AuthService.rateReservation(reservation.toyId, result.rating, result.comment)
            Alerts.success('Ocena je uspešno sačuvana!')
            this.reloadComponent()
        }
    })
}
doChangeStatus(reservation: ReservationModel, status: 'rezervisano' | 'pristiglo' | 'otkazano') {
    const labels = {
        'pristiglo': 'pristiglom',
        'otkazano': 'otkazanom',
        'rezervisano': 'rezervisanom'
    }
    Alerts.confirm(`Da li želite da označite igračku kao ${labels[status]}?`, () => {
        AuthService.changeReservationStatus(reservation.toyId, status)
        this.reloadComponent()
    })
}
  getStars(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1)
  }
}
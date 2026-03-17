import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { ToyModel, ReviewModel } from '../../models/toy.model';
import { ToyService } from '../services/toy.service';
import { AuthService } from '../services/auth.service';
import { ReservationModel } from '../../models/reservation.model';
import { Alerts } from '../alerts';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-details',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    DatePipe,
    RouterLink,
    Loading
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  public authService = AuthService
  toy = signal<ToyModel | null>(null)
  reviews: ReviewModel[] = []
  userReservation = signal<ReservationModel | null>(null)

  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => {
      const id = Number(params['id'])
      ToyService.getToyById(id)
        .then(rsp => {
          this.toy.set(rsp.data)
          this.reviews = rsp.data.reviews ?? []
          this.loadUserReservation(id)
        })
        .catch(() => Alerts.error('Greška pri učitavanju igračke!'))
    })
  }

  loadUserReservation(toyId: number) {
    const reservations = AuthService.getReservations()
    const res = reservations.find(r => r.toyId === toyId && r.status === 'pristiglo')
    this.userReservation.set(res ?? null)
  }

  getImageUrl() {
    return 'https://toy.pequla.com' + this.toy()!.imageUrl
  }

  doReserve() {
    AuthService.addReservation(this.toy()!)
    Alerts.success(`Igračka "${this.toy()!.name}" je uspešno rezervisana!`)
  }

  getStars(rating: number): string {
    return '⭐'.repeat(Math.max(0, Math.min(5, rating)))
  }

  getAverageRating(): string {
    const apiReviews = this.reviews ?? []
    const userRes = this.userReservation()

    let allRatings = apiReviews.map(r => r.rating)

    if (userRes && userRes.rating !== null) {
        allRatings.push(userRes.rating)
    }

    if (allRatings.length === 0) return 'Nema ocena'
    const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
    return '⭐ ' + avg.toFixed(1)
}
}
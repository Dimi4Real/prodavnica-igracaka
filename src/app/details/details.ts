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
import { Alerts } from '../alerts';
import { Loading } from '../loading/loading';
import { CommonModule } from '@angular/common';

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
    Loading,
    CommonModule
  ],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

  public authService = AuthService
  toy = signal<ToyModel | null>(null)
  reviews: ReviewModel[] = []

  constructor(route: ActivatedRoute) {
    route.params.subscribe(params => {
    const id = Number(params['id'])
    ToyService.getToyById(id)
        .then(rsp => {
            console.log('Details toy:', rsp.data)
            this.toy.set(rsp.data)
            this.reviews = rsp.data.reviews ?? []
        })
        .catch(() => Alerts.error('Greška pri učitavanju igračke!'))
})
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
    if (!this.reviews || this.reviews.length === 0) return 'Nema ocena'
    const avg = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length
    return avg.toFixed(1)
  }

  
}
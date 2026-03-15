import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ToyModel } from '../../models/toy.model';
import { ToyService } from '../services/toy.service';
import { AuthService } from '../services/auth.service';
import { Loading } from '../loading/loading';
import { Alerts } from '../alerts';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    Loading
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public authService = AuthService
  toys = signal<ToyModel[]>([])

  constructor() {
    ToyService.getToys()
      .then(rsp => this.toys.set(rsp.data))
      .catch(() => Alerts.error('Greška pri učitavanju igračaka!'))
  }

  getImageUrl(toy: ToyModel) {
    return 'https://toy.pequla.com' + toy.imageUrl
  }

  doReserve(toy: ToyModel) {
    if (!AuthService.getActiveUser()) return
    AuthService.addReservation(toy)
    Alerts.success(`Igračka "${toy.name}" je uspešno rezervisana!`)
  }

  getAverageRating(toy: ToyModel): string {
    if (!toy.reviews || toy.reviews.length === 0) return 'Nema ocena'
    const avg = toy.reviews.reduce((sum, r) => sum + r.rating, 0) / toy.reviews.length
    return '⭐ ' + avg.toFixed(1)
  }
}
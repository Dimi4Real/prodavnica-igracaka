import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ToyModel, AgeGroupModel, ToyTypeModel } from '../../models/toy.model';
import { ToyService } from '../services/toy.service';
import { AuthService } from '../services/auth.service';
import { Alerts } from '../alerts';
import { Loading } from '../loading/loading';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDividerModule,
    Loading
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  public authService = AuthService
  allToys = signal<ToyModel[]>([])
  filteredToys = signal<ToyModel[]>([])
  ageGroups = signal<AgeGroupModel[]>([])
  toyTypes = signal<ToyTypeModel[]>([])

  filterName: string = ''
  filterDescription: string = ''
  filterType: string = ''
  filterAgeGroup: string = ''
  filterTargetGroup: string = ''
  filterDateFrom: string = ''
  filterDateTo: string = ''
  filterPriceMin: number | null = null
  filterPriceMax: number | null = null
  filterMinRating: number | null = null

  constructor() {
    ToyService.getToys()
      .then(rsp => {
        this.allToys.set(rsp.data)
        this.filteredToys.set(rsp.data)
      })
      .catch(() => Alerts.error('Greška pri učitavanju igračaka!'))

    ToyService.getAgeGroups()
      .then(rsp => this.ageGroups.set(rsp.data))

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data))
  }

  doSearch() {
    let result = this.allToys()

    if (this.filterName.trim()) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(this.filterName.toLowerCase())
      )
    }

    if (this.filterDescription.trim()) {
      result = result.filter(t =>
        t.description.toLowerCase().includes(this.filterDescription.toLowerCase())
      )
    }

    if (this.filterType) {
      result = result.filter(t => t.type.name === this.filterType)
    }

    if (this.filterAgeGroup) {
      result = result.filter(t => t.ageGroup.name === this.filterAgeGroup)
    }

    if (this.filterTargetGroup) {
      result = result.filter(t => t.targetGroup === this.filterTargetGroup)
    }

    if (this.filterDateFrom) {
      result = result.filter(t =>
        new Date(t.productionDate) >= new Date(this.filterDateFrom)
      )
    }

    if (this.filterDateTo) {
      result = result.filter(t =>
        new Date(t.productionDate) <= new Date(this.filterDateTo)
      )
    }

    if (this.filterPriceMin !== null) {
      result = result.filter(t => t.price >= this.filterPriceMin!)
    }

    if (this.filterPriceMax !== null) {
      result = result.filter(t => t.price <= this.filterPriceMax!)
    }

   if (this.filterMinRating !== null) {
    result = result.filter(t => {
        const apiReviews = t.reviews ?? []
        const userRes = AuthService.getReservations().find(r => r.toyId === t.toyId && r.rating !== null)

        let allRatings = apiReviews.map(r => r.rating)

        if (userRes && userRes.rating !== null) {
            allRatings.push(userRes.rating)
        }

        if (allRatings.length === 0) return false
        const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
        return avg >= this.filterMinRating!
    })
}

    this.filteredToys.set(result)
  }

  doReset() {
    this.filterName = ''
    this.filterDescription = ''
    this.filterType = ''
    this.filterAgeGroup = ''
    this.filterTargetGroup = ''
    this.filterDateFrom = ''
    this.filterDateTo = ''
    this.filterPriceMin = null
    this.filterPriceMax = null
    this.filterMinRating = null
    this.filteredToys.set(this.allToys())
  }

  getImageUrl(toy: ToyModel) {
    return 'https://toy.pequla.com' + toy.imageUrl
  }

  doReserve(toy: ToyModel) {
    AuthService.addReservation(toy)
    Alerts.success(`Igračka "${toy.name}" je uspešno rezervisana!`)
  }

  getAverageRating(toy: ToyModel): string {
    const apiReviews = toy.reviews ?? []
    const userReservations = AuthService.getReservations()
    const userRes = userReservations.find(r => r.toyId === toy.toyId && r.rating !== null)

    let allRatings = apiReviews.map(r => r.rating)

    if (userRes && userRes.rating !== null) {
        allRatings.push(userRes.rating)
    }

    if (allRatings.length === 0) return 'Nema ocena'
    const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
    return '⭐ ' + avg.toFixed(1)
}
}
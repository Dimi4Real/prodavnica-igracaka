import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToyService } from '../services/toy.service';
import { Alerts } from '../alerts';
import { UserModel } from '../../models/user.model';
import { ToyTypeModel } from '../../models/toy.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    FormsModule,
    RouterLink,
    MatDividerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user: UserModel = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    favoriteToyTypes: [],
    reservations: []
  }

  passwordRepeat: string = ''
  toyTypes = signal<ToyTypeModel[]>([])
  selectedType: string = ''

  constructor(private router: Router) {
    if (AuthService.getActiveUser()) {
      router.navigate(['/'])
    }

    ToyService.getToyTypes()
      .then(rsp => this.toyTypes.set(rsp.data))
      .catch(() => Alerts.error('Greška pri učitavanju tipova igračaka!'))
  }

  addFavoriteType() {
    if (!this.selectedType) return
    if (!this.user.favoriteToyTypes.includes(this.selectedType)) {
      this.user.favoriteToyTypes.push(this.selectedType)
    } else {
      Alerts.error('Ovaj tip igračke je već dodat!')
    }
    this.selectedType = ''
  }

  removeFavoriteType(type: string) {
    this.user.favoriteToyTypes = this.user.favoriteToyTypes.filter(t => t !== type)
  }

  doRegister() {
    if (!this.user.firstName || !this.user.lastName) {
      Alerts.error('Ime i prezime su obavezni!')
      return
    }

    if (!this.user.email) {
      Alerts.error('Email je obavezan!')
      return
    }

    if (this.user.password.length < 6) {
      Alerts.error('Lozinka mora imati najmanje 6 karaktera!')
      return
    }

    if (this.user.password !== this.passwordRepeat) {
      Alerts.error('Lozinke se ne poklapaju!')
      return
    }

    if (!this.user.phone || !this.user.address) {
      Alerts.error('Telefon i adresa su obavezni!')
      return
    }

    if (this.user.favoriteToyTypes.length === 0) {
      Alerts.error('Dodajte bar jednu omiljenu vrstu igračke!')
      return
    }

    const success = AuthService.register(this.user)
    if (!success) {
      Alerts.error('Korisnik sa tim emailom već postoji!')
      return
    }

    Alerts.success('Registracija uspešna! Možete se prijaviti.')
    this.router.navigate(['/login'])
  }
}
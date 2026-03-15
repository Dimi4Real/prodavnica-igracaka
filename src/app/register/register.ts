import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Alerts } from '../alerts';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    RouterLink
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

  constructor(private router: Router) {
    if (AuthService.getActiveUser()) {
      router.navigate(['/'])
    }
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

    const success = AuthService.register(this.user)
    if (!success) {
      Alerts.error('Korisnik sa tim emailom već postoji!')
      return
    }

    Alerts.success('Registracija uspešna! Možete se prijaviti.')
    this.router.navigate(['/login'])
  }
}
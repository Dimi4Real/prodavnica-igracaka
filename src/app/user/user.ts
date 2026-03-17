import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../services/auth.service';
import { Alerts } from '../alerts';
import { UserModel } from '../../models/user.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    FormsModule,
    RouterLink,
    MatDividerModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  activeUser: UserModel | null = AuthService.getActiveUser()
  oldPassword = ''
  newPassword = ''
  passRepeat = ''
  newFavoriteType = ''

  constructor(private router: Router) {
    if (!AuthService.getActiveUser()) {
      router.navigate(['/login'])
    }
  }

  getAvatarUrl() {
    return `https://ui-avatars.com/api/?name=${this.activeUser?.firstName}+${this.activeUser?.lastName}&size=128&background=random`
  }

  updateUser() {
    Alerts.confirm('Da li želite da sačuvate izmene?', () => {
      AuthService.updateActiveUser(this.activeUser!)
      Alerts.success('Podaci su uspešno ažurirani!')
    })
  }

  updatePassword() {
    if (this.oldPassword !== this.activeUser?.password) {
      Alerts.error('Stara lozinka nije ispravna!')
      return
    }

    if (this.newPassword.length < 6) {
      Alerts.error('Nova lozinka mora imati najmanje 6 karaktera!')
      return
    }

    if (this.newPassword !== this.passRepeat) {
      Alerts.error('Lozinke se ne poklapaju!')
      return
    }

    if (this.newPassword === this.activeUser?.password) {
      Alerts.error('Nova lozinka mora biti različita od stare!')
      return
    }

    Alerts.confirm('Da li želite da promenite lozinku?', () => {
      AuthService.updateActiveUserPassword(this.newPassword)
      Alerts.success('Lozinka je uspešno promenjena!')
      AuthService.logout()
      this.router.navigate(['/login'])
    })
  }

  addFavoriteType() {
    if (!this.newFavoriteType.trim()) return
    if (!this.activeUser!.favoriteToyTypes.includes(this.newFavoriteType.trim())) {
      this.activeUser!.favoriteToyTypes.push(this.newFavoriteType.trim())
    }
    this.newFavoriteType = ''
  }

  removeFavoriteType(type: string) {
    this.activeUser!.favoriteToyTypes = this.activeUser!.favoriteToyTypes.filter(t => t !== type)
  }

  getReservationCount(): number {
    return AuthService.getReservations().length
  }

  getActiveReservationCount(): number {
    return AuthService.getReservations().filter(r => r.status === 'rezervisano').length
  }
}
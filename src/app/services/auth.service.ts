import { UserModel } from "../../models/user.model"
import { ReservationModel } from "../../models/reservation.model"
import { ToyModel } from "../../models/toy.model"

const USERS_KEY = 'users'
const ACTIVE_KEY = 'active'

const baseUser: UserModel = {
    firstName: 'Dimitrije',
    lastName: 'Cvetkovic',
    email: 'user@example.com',
    password: 'user123',
    phone: '0631234567',
    address: 'Ulica primer 1, Nis',
    favoriteToyTypes: ['slagalica', 'figura'],
    reservations: []
}

export class AuthService {

    static getUsers(): UserModel[] {
        if (localStorage.getItem(USERS_KEY) == null) {
            localStorage.setItem(USERS_KEY, JSON.stringify([baseUser]))
        }
        return JSON.parse(localStorage.getItem(USERS_KEY)!)
    }

    static login(email: string, password: string): boolean {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email && u.password === password) {
                localStorage.setItem(ACTIVE_KEY, email)
                return true
            }
        }
        return false
    }

    static register(user: UserModel): boolean {
        const users = this.getUsers()
        const exists = users.find(u => u.email === user.email)
        if (exists) return false

        users.push(user)
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
        return true
    }

    static getActiveUser(): UserModel | null {
        const email = localStorage.getItem(ACTIVE_KEY)
        if (!email) return null
        const users = this.getUsers()
        return users.find(u => u.email === email) ?? null
    }

    static updateActiveUser(newData: UserModel) {
        const users = this.getUsers()
        const email = localStorage.getItem(ACTIVE_KEY)
        for (let u of users) {
            if (u.email === email) {
                u.firstName = newData.firstName
                u.lastName = newData.lastName
                u.phone = newData.phone
                u.address = newData.address
                u.favoriteToyTypes = newData.favoriteToyTypes
            }
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    static updateActiveUserPassword(newPassword: string) {
        const users = this.getUsers()
        const email = localStorage.getItem(ACTIVE_KEY)
        for (let u of users) {
            if (u.email === email) {
                u.password = newPassword
            }
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    static logout() {
        localStorage.removeItem(ACTIVE_KEY)
    }

    static addReservation(toy: ToyModel) {
    const users = this.getUsers()
    const email = localStorage.getItem(ACTIVE_KEY)

    const reservation: ReservationModel = {
        toyId: toy.toyId,
        toyName: toy.name,
        toyPrice: toy.price,
        status: 'rezervisano',
        createdAt: new Date().toISOString(),
        rating: null
    }

    for (let u of users) {
    if (u.email === email) {
        u.reservations = u.reservations ?? []
        u.reservations.push(reservation)
    }
}
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

    static getReservations(): ReservationModel[] {
        return this.getActiveUser()?.reservations ?? []
    }

    static updateReservation(toyId: number, newData: Partial<ReservationModel>) {
    const users = this.getUsers()
    const email = localStorage.getItem(ACTIVE_KEY)
    for (let u of users) {
        if (u.email === email) {
            const res = u.reservations.find(r => r.toyId === toyId && r.status === 'rezervisano')
            if (res) Object.assign(res, newData)
        }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

static deleteReservation(toyId: number, status: string) {
    const users = this.getUsers()
    const email = localStorage.getItem(ACTIVE_KEY)
    for (let u of users) {
        if (u.email === email) {
            u.reservations = u.reservations.filter(
                r => !(r.toyId === toyId && r.status === status)
            )
        }
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

    static rateReservation(toyId: number, rating: number) {
        const users = this.getUsers()
        const email = localStorage.getItem(ACTIVE_KEY)
        for (let u of users) {
            if (u.email === email) {
                const res = u.reservations.find(r => r.toyId === toyId && r.status === 'pristiglo')
                if (res) res.rating = rating
            }
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
}
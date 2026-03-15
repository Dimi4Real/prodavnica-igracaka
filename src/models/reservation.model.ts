export interface ReservationModel {
    toyId: number
    toyName: string
    toyPrice: number
    status: 'rezervisano' | 'pristiglo' | 'otkazano'
    createdAt: string
    rating: number | null
}
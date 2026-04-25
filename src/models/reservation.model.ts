export interface ReservationModel {
    toyId: number
    toyName: string
    toyDescription: string
    toyType: string
    toyAgeGroup: string
    toyTargetGroup: string
    toyProductionDate: string
    toyPrice: number
    status: 'rezervisano' | 'pristiglo' | 'otkazano'
    createdAt: string
    rating: number | null
    reviewComment: string | null
}
export interface ReviewModel {
    id: number
    author: string
    comment: string
    rating: number
    createdAt: string
}

export interface AgeGroupModel {
    id: number
    name: string
}

export interface ToyTypeModel {
    id: number
    name: string
}

export interface ToyModel {
    id: number
    permalink: string
    name: string
    description: string
    type: ToyTypeModel
    ageGroup: AgeGroupModel
    targetGroup: 'svi' | 'dečak' | 'devojčica'
    productionDate: string
    price: number
    imageUrl: string
    reviews: ReviewModel[]
}
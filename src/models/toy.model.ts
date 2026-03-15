export interface ReviewModel {
    reviewId: number
    author: string
    comment: string
    rating: number
    createdAt: string
}

export interface AgeGroupModel {
    ageGroupId: number
    name: string
    description: string
}

export interface ToyTypeModel {
    typeId: number
    name: string
    description: string
}

export interface ToyModel {
    toyId: number
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
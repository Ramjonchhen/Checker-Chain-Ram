import { NoProfileImage } from "assets/images"

export const getBaseBackendImageUrl: (path?: string | null, type?: 'avatar' | 'other' )=> string = (path= '', type='other') => {
    if(!path && type === 'avatar'){
        return NoProfileImage.src
    }
    return `${process.env.NEXT_PUBLIC_SPACE_BASE}${path}`
}
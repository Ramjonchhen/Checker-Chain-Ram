export interface UploadProfilePictureProps {
    onChange?: () => void
    setImageFile: (imageFile: File | undefined) => void
  }
  
  export interface UploadProfilePictureFormData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: File | undefined
  }
  
  export type UploadProfilePictureFormKeys = "file"
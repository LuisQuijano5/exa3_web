export const getBase64ImageSrc = (base64String: string | undefined | null) => {
  if (!base64String) return '/public/assets/default-avatar.jpg'; 
  
  if (base64String.startsWith('data:image')) return base64String;

  return `data:image/jpeg;base64,${base64String}`;
};
export const formatRelativeTime = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  const now = new Date();
  
  // Diferença em segundos
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "agora mesmo";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `há ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `há ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `há ${diffInDays} ${diffInDays === 1 ? 'dia' : 'dias'}`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "há 1 mês";
  
  return "há mais de 1 mês";
};
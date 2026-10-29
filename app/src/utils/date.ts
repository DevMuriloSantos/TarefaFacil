export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

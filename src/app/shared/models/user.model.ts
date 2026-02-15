export interface User {
  id?: string;      // Opcional, lo genera el servidor
  email: string;
  name: string;
  role: string;
  password?: string; // <--- Añade esto (puedes ponerlo opcional con ?)
}
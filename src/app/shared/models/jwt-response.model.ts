import { User } from './user.model';

/** Respuesta del servidor tras autenticación exitosa */
export interface JwtResponse {
  token: string;
  user: User;
}
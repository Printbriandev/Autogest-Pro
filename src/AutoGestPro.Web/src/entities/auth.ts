export type LoginRequest = {
  nombreUsuario: string;
  password: string;
};

export type Session = {
  idUsuario: number;
  nombreCompleto: string;
  rol: string;
  token: string;
  fechaExpiracion: string;
};

export interface Templo {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  pais: string;
  pastorPrincipalId: string;
  fechaFundacion: Date;
}

// Interfaz DTO para la creación/actualización (sin el 'id' ni 'fechaFundacion' autogenerada)
export interface TemploDTO {
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  pais: string;
  pastorPrincipalId: string;
  fechaFundacion: string; // Se enviará como string (ej. YYYY-MM-DD)
}
export interface Miembro {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fechaNacimiento: Date;
  estado: 'SERVIDOR' | 'BAUTIZADO' | 'SIMPATIZANTE' | 'NO_ASOCIADO';
  temploId: string;
  activo: boolean;
  fechaRegistro: Date;
  fechaBautismo?: Date;
}
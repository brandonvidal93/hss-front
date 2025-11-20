export interface Pastor {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  fechaNacimiento: Date;
  fechaOrdenacion: Date;
  licenciaMinisterial: string;
  estado: 'ACTIVO' | 'JUBILADO' | 'SANCIONADO' | 'EN_PROCESO';
  temploId: string;
}
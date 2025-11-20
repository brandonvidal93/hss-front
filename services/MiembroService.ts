import axios from "axios";
import { Miembro } from "../types/Miembro";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const MiembroServices = {
  async getAll(): Promise<Miembro[]> {
    const response = await axios.get(`${API_BASE_URL}/miembros`);
    return response.data;
  },

  async getById(id: string): Promise<Miembro> {
    const response = await axios.get(`${API_BASE_URL}/miembros/${id}`);
    return response.data;
  },

  async create(miembro: Miembro): Promise<Miembro> {
    const response = await axios.post(`${API_BASE_URL}/miembros`, miembro);
    return response.data;
  },

  async update(id: string, miembro: Miembro): Promise<Miembro> {
    const response = await axios.put(`${API_BASE_URL}/miembros/${id}`, miembro);
    return response.data;
  },

  async asignarTemplo(id: string, temploId: string): Promise<Miembro> {
    const response = await axios.put(`${API_BASE_URL}/miembros/${id}/asignar-templo`, { temploId });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/miembros/${id}`);
  },
};
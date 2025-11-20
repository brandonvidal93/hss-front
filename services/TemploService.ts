import axios from "axios";
import { Miembro } from "../types/Miembro";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const TemploServices = {
  async getAll(): Promise<Miembro[]> {
    const response = await axios.get(`${API_BASE_URL}/templos`);
    return response.data;
  },

  async getById(id: string): Promise<Miembro> {
    const response = await axios.get(`${API_BASE_URL}/templos/${id}`);
    return response.data;
  },

  async create(templo: Miembro): Promise<Miembro> {
    const response = await axios.post(`${API_BASE_URL}/templos`, templo);
    return response.data;
  },

  async update(id: string, templo: Miembro): Promise<Miembro> {
    const response = await axios.put(`${API_BASE_URL}/templos/${id}`, templo);
    return response.data;
  },

  async asignarPastor(temploId: string, pastorId: string): Promise<Miembro> {
    const response = await axios.put(`${API_BASE_URL}/templos/${temploId}/asignar-pastor`, { pastorId });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/templos/${id}`);
  },
};
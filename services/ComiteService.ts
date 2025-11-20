import axios from "axios";
import { Comite } from "../types/Comite";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ComiteServices = {
  getAll: async (): Promise<Comite[]> => {
    const response = await axios.get(`${API_BASE_URL}/comites`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Comite> => {
    const response = await axios.get(`${API_BASE_URL}/comites/${id}`);
    return response.data;
  },

  create: async (comite: Omit<Comite, 'id' | 'fechaCreacion'>): Promise<Comite> => {
    const response = await axios.post(`${API_BASE_URL}/comites`, comite);
    return response.data;
  },

  update: async (id: string, comite: Comite): Promise<Comite> => {
    const response = await axios.put(`${API_BASE_URL}/comites/${id}`, comite);
    return response.data;
  },

  asignarLider : async (comiteId: string, liderId: string): Promise<Comite> => {
    const response = await axios.put(`${API_BASE_URL}/comites/${comiteId}/asignar-lider`, { liderId });
    return response.data;
  },

  asignarTemplo : async (comiteId: string, temploId: string): Promise<Comite> => {
    const response = await axios.put(`${API_BASE_URL}/comites/${comiteId}/asignar-templo`, { temploId });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/comites/${id}`);
  },
};
import axios from "axios";
import { Pastor } from "../types/Pastor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const PastorServices = {
  getAll: async (): Promise<Pastor[]> => {
    const response = await axios.get(`${API_BASE_URL}/pastores`);
    return response.data;
  },

  getById: async (id: string): Promise<Pastor> => {
    const response = await axios.get(`${API_BASE_URL}/pastores/${id}`);
    return response.data;
  },

  create: async (pastor: Pastor): Promise<Pastor> => {
    const response = await axios.post(`${API_BASE_URL}/pastores`, pastor);
    return response.data;
  },

  update: async (id: string, pastor: Pastor): Promise<Pastor> => {
    const response = await axios.put(`${API_BASE_URL}/pastores/${id}`, pastor);
    return response.data;
  },

  asignarTemplo: async (pastorId: string, temploId: string): Promise<Pastor> => {
    const response = await axios.put(`${API_BASE_URL}/pastores/${pastorId}/asignar-templo`, { temploId });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/pastores/${id}`);
  },
}
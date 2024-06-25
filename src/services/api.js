// src/services/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api-tambula.netlify.app/.netlify/functions/api", // URL do seu backend
  withCredentials: false, // Isso dependerá de como você configurou seu backend
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "*",
  },
});
const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "*",
  },
};

export default {
  addPlace(place) {
    return apiClient.post("/addPlace", place, config);
  },
  getPlaces() {
    return apiClient.get(`/places`, config);
  },
  getPlace(id) {
    return apiClient.get(`/place/${id}`, config);
  },
  updatePlace(id, place) {
    return apiClient.put(`/place/${id}`, place, config);
  },
  deletePlace(id) {
    return apiClient.delete(`/place/${id}`, config);
  },
};

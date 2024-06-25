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

export default {
  addPlace(place) {
    return apiClient.post("/addPlace", place);
  },
  getPlaces() {
    var config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "*",
      },
    };
    // return axios.get("http://localhost:3000/places", config);

    return new Promise(async (resolve, reject) => {
      try {
        axios
          .get(
            `https://api-tambula.netlify.app/.netlify/functions/api/places`,
            config
          )
          .then((data) => {
            resolve({
              code: 1,
              message: data,
              data,
            });
            /* if (data) {
              resolve({
                code: 1,
                message: data,
                data,
              });
            } else {
              resolve({
                code: 2,
                data: data,
                message: data,
              });
            } */
          })
          .catch(function (error) {
            /* if (error.response) {
              if (error.response.status === 400)
                resolve({ code: 4, message: error });
            } else {
              resolve({
                code: 5,
                message: "Ocorreu um erro, verifique a sua conexão.",
              });
            } */
            resolve({
              code: 5,
              message: "Ocorreu um erro, verifique a sua conexão.",
              error,
            });
          });
      } catch (error) {
        resolve({
          code: 4,
          message: "Ops! Verifique a sua conexão, ocorreu um erro. ",
          error,
        });
      }
    });
  },
  getPlace(id) {
    return apiClient.get(`/place/${id}`);
  },
  updatePlace(id, place) {
    return apiClient.put(`/place/${id}`, place);
  },
  deletePlace(id) {
    return apiClient.delete(`/place/${id}`);
  },
};

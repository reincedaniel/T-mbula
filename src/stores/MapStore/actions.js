import axios from "axios";
/* const configHeader = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,",
    "Access-Control-Allow-Methods": "*",
  },
}; */
export default {
  addMaker(event) {
    this.makers.push(event);
  },
  async getAddressFromLatLong(lat, long) {
    let result = null;
    await axios
      .get(
        `${process.env.VITE_GOOGLE_API}/maps/api/geocode/json?address=${lat},${long}&key=AIzaSyD7YVBILJ10vi7GEiD7E8zyYOAFfTxGbXI`
      )
      .then((res) => {
        if (res.data.error_message) {
          result = {
            code: 400,
            data: "Não foi possível encontrar a sua localização.",
          };
        } else {
          result = { code: 200, data: res.data.results[0].formatted_address };
        }
      })
      .catch((err) => {
        result = { code: 401, data: "Erro ao realizar esta operação." };
      });

    return result;
  },
  async getAutocompleteLibrary(lat, long) {
    let result = null;
    await axios
      .get(
        `${process.env.VITE_GOOGLE_API}/maps/api/js?libraries=places&key=AIzaSyD7YVBILJ10vi7GEiD7E8zyYOAFfTxGbXI`
      )
      .then((res) => {
        if (res.data.error_message) {
          result = {
            code: 400,
            data: "Não foi possível encontrar a sua localização.",
          };
        } else {
          result = { code: 200, data: res.data.results[0].formatted_address };
        }
      })
      .catch((err) => {
        result = { code: 401, data: "Erro ao realizar esta operação." };
      });

    return result;
  },
};

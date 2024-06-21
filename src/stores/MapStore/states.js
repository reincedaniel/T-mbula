export default () => ({
  makers: [{ id: "9727g9u", name: "Lourenço Carlos" }],
  isLogged: !!localStorage.getItem("userLogged"),
  poi: [],
  finalPosition: { lat: 0, lng: 0 },
  myPosition: { lat: 0, lng: 0 },
  address: null,
});

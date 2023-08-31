import axios from "axios";

export default axios.create({
  baseURL: "https://vent-production.up.railway.app/api/vent",
  // baseURL: "http://localhost:5000/api/vent",
  // baseURL: "https://ventapi.onrender.com/api/vent"
});

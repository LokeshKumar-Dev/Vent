import axios from "axios";

export default axios.create({
  baseURL: "https://ventapi.onrender.com/api/vent",
});

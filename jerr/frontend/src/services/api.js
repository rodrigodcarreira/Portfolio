import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:5000/api", //url de exemplo é necessário inserir o verdadeiro do backend da api
	// baseURL: "/api",
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		return Promise.reject(error);
	}
);

export default api;

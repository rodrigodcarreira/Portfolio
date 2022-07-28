import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const queryClient = useQueryClient();
	// const navigate = useNavigate();

	const [token, setToken] = useLocalStorage({
		key: "token",
		defaultValue: null,
	});

	const { data, isLoading, refetch, isSuccess } = useQuery(
		["user"],
		async () =>
			await api
				.get("/users/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => res.data),
		{
			enabled: token !== null,
			retry: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			refetchInterval: 1000 * 60 * 60,
			cacheTime: 1000 * 60 * 60 * 12,
			onSuccess: (data) => {
				setToken(data.token);
			},
			onError: (error) => {
				setToken(null);
			},
		}
	);

	useEffect(() => {
		api.defaults.headers["Authorization"] = "Bearer " + token;
		api.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error.response.status === 401) {
					setToken(null);
					queryClient.invalidateQueries("user");
				} else if (error.response.status === 403) {
					// navigate("/403", { replace: true });
				}

				return Promise.reject(error);
			}
		);
	}, []);

	const uploadPhoto = async (file) => {
		const formData = new FormData();
		formData.append("avatar", file);

		const res = await api.post("/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data;
	};

	const signIn = async ({ email, password }) => {
		try {
			const { data } = await api.post("/users/authenticate", {
				email,
				password,
			});

			queryClient.setQueryData("user", data);
			setToken(data.token);
			api.defaults.headers["Authorization"] = "Bearer " + data.token;

			return data;
		} catch (err) {
			throw err.response.data;
		}
	};

	const register = async (values) => {
		try {
			const { data } = await api.post("/users", values);
			return data;
		} catch (err) {
			throw err.response.data;
		}
	};

	const update = async (values) => {
		try {
			const { data } = await api.put("/users/user", values);
			refetch();

			return data;
		} catch (err) {
			throw err.response.data;
		}
	};

	const logOut = () => {
		setToken(null);
		api.defaults.headers["Authorization"] = undefined;
		queryClient.removeQueries("user");
		queryClient.invalidateQueries("user");
	};

	return (
		<AuthContext.Provider
			value={{
				user: isSuccess ? data?.user : null,
				isLoading: isLoading,
				isAuthenticated: !!token && isSuccess,
				uploadPhoto,
				signIn,
				register,
				update,
				logOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => useContext(AuthContext);
export default useAuth;

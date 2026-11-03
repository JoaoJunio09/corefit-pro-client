import { AccountCredentials } from "../models/auth/AccountCredentials";
import api from "./api";

class AuthService {
	BASE_URL = '';

	constructor() {
		this.BASE_URL = '/auth';
	}

	async signIn(credentials: AccountCredentials) {
		const URL = `${this.BASE_URL}/sign`;
		try {
			const response = await api.post(URL, credentials);
			return response.data;
		}
		catch (err: any) {
			if (err?.response?.status === 403) {
				console.log('Não foi possível autenticar usuário');
			}

			if (err?.response?.status === 500) {
				console.log('Usuário ou senha inválidos');
			}

			throw err;
		}
	}

	async register(credentials: AccountCredentials) {
		const URL = `${this.BASE_URL}/register`;
		const response = await api.post(URL, credentials);
		return response.data;
	}
}

export default AuthService;

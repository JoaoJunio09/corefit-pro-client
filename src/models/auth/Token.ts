export interface Token {
	username: string,
	fullName: string,
	roles: string[],
	authenticated: boolean,
	created: Date,
	expiration: Date,
	accessToken: string,
	refreshToken: string
}
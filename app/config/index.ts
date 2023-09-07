import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
	env: process.env.NODE_ENV || "development",
	authorization: {
		username: process.env.AUTHORIZATION_USERNAME || "itera",
		passsword: process.env.AUTHORIZATION_PASSWORD || "areti", //p!s4n9-g0d0k-s3g0-t!wul
	},
	session: {
		secret: process.env.SESSION_SECRET || "itera-session-secret",
		name: process.env.SESSION_NAME || "itera",
	},
	base_url_api: process.env.BASE_URL_API_DEFAULT || "http://localhost:8000", //"https://lucky-bedclothes-dove.cyclic.app/",
};

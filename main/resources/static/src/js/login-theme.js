/**
 * ==========================================================
 * AbrazaMente
 * Login Google Auth
 * ==========================================================
 */

class GoogleAuthManager {

    constructor() {

        this.button = document.getElementById("google-login-button");

        this.nativeButtonContainer = document.getElementById("google-signin-native");

        this.configUrl = "http://localhost:8080/auth/google/client-id";

        this.authUrl = "http://localhost:8080/auth/google";

    }

    async init() {

        if (!this.button || !this.nativeButtonContainer) {

            return;

        }

        this.button.disabled = true;

        try {

            await this.waitForGoogleIdentity();

            const { clientId } = await this.getGoogleConfig();

            window.google.accounts.id.initialize({

                client_id: clientId,

                callback: (response) => this.handleGoogleLogin(response)

            });

            window.google.accounts.id.renderButton(

                this.nativeButtonContainer,

                {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text: "continue_with",
                    shape: "pill"
                }

            );

            this.button.addEventListener(
                "click",
                () => this.openGoogleLogin()
            );

            this.button.disabled = false;

        } catch (error) {

            console.error("No se pudo inicializar Google Login:", error);

            this.button.disabled = false;

        }

    }

    waitForGoogleIdentity() {

        return new Promise((resolve, reject) => {

            let attempts = 0;

            const interval = window.setInterval(() => {

                attempts += 1;

                if (window.google?.accounts?.id) {

                    window.clearInterval(interval);

                    resolve();

                    return;

                }

                if (attempts > 50) {

                    window.clearInterval(interval);

                    reject(new Error("Google Identity Services no cargo."));

                }

            }, 100);

        });

    }

    async getGoogleConfig() {

        const response = await fetch(this.configUrl);

        if (!response.ok) {

            throw new Error("No se pudo obtener GOOGLE_CLIENT_ID.");

        }

        return response.json();

    }

    openGoogleLogin() {

        const nativeGoogleButton =
            this.nativeButtonContainer.querySelector("div[role='button']");

        if (nativeGoogleButton) {

            nativeGoogleButton.click();

            return;

        }

        window.google.accounts.id.prompt();

    }

    async handleGoogleLogin(response) {

        if (!response?.credential) {

            console.error("Google no devolvio credenciales.");

            return;

        }

        this.button.disabled = true;

        try {

            const authData = await this.sendToken(response.credential);

            localStorage.setItem("authToken", authData.token);

            localStorage.setItem(
                "authUser",
                JSON.stringify({
                    id: authData.userId,
                    email: authData.email,
                    nombres: authData.nombres,
                    apellidos: authData.apellidos
                })
            );

            console.log("Sesion iniciada con Google:", authData);

        } catch (error) {

            console.error("No se pudo iniciar sesion con Google:", error);

        } finally {

            this.button.disabled = false;

        }

    }

    async sendToken(idToken) {

        const response = await fetch(this.authUrl, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                idToken
            })

        });

        if (!response.ok) {

            throw new Error("El backend rechazo el token de Google.");

        }

        return response.json();

    }

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const googleAuth = new GoogleAuthManager();

        googleAuth.init();

    }
);

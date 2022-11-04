import Keycloak from "keycloak-js";

const kc: any = Keycloak({
  url: "https://auth.flexit.uz/auth",
  realm: "demo",
  clientId: "msb",
});

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback: any) => {
  kc.init({
    checkLoginIframe: true,
    checkLoginIframeInterval: 25,
    onLoad: "login-required",
  })
    .then((authenticated: any) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
        doLogin();
      }
      onAuthenticatedCallback();
      localStorage.setItem("token", kc.token);
      localStorage.setItem("user", JSON.stringify(kc.tokenParsed));
    })
    .catch(console.error);
};

const doLogin = kc.login;

const doLogout = kc.logout;

const getToken = () => kc.token;
const getParsedToken = () => kc.tokenParsed;

const isLoggedIn = () => !!kc.token;

const updateToken = (successCallback: any) =>
  kc.updateToken(5).then(successCallback).catch(doLogin);

const getUserPreferredName = () => kc.tokenParsed?.preferred_username;
const getUserName = () => kc.tokenParsed?.name;

const hasRole = (roles: any) =>
  roles.some((role: any) => kc.hasRealmRole(role));

const UserService = {
  initKeycloak,
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getParsedToken,
  updateToken,
  getUserPreferredName,
  getUserName,
  hasRole,
};

export default UserService;

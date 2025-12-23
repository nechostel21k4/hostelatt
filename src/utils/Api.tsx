import axios from "axios";

const server = process.env.REACT_APP_SERVER;

export const getExistingToken = () => {
  const tokens = [
    localStorage.getItem("adminToken"),
    localStorage.getItem("inchargeToken"),
    localStorage.getItem("facultyToken"),
    localStorage.getItem("studentToken"),
  ];
  return tokens.find((token) => token) || null; // Get first available token
};

const removeTokens = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("inchargeToken");
  localStorage.removeItem("facultyToken");
  localStorage.removeItem("studentToken");

  localStorage.removeItem("adminExist");
  localStorage.removeItem("inchargeExist");
  localStorage.removeItem("facultyExist");
  localStorage.removeItem("studentExist");
};

const api = axios.create({
  baseURL: server,
  headers: {
    "Content-Type": "application/json",
  },

});

api.interceptors.request.use(
  (config) => {
    const token = getExistingToken();
    if (token) {
      const formattedToken = token.replace(/"/g, "");
      // console.log("🔑 Using Token:", formattedToken);
      config.headers.Authorization = `Bearer ${formattedToken}`;
    } else {
      console.warn("⚠️ No Token Found in Local Storage!");
    }
    // console.log("🚀 Sending Request:", config.method, config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor for Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's the hardcoded dev token
    const token = getExistingToken();
    const isDevToken = token && token.includes(".dummy");

    if (error.response) {
      const status = error.response.status;

      // If using dev token, ignore auth errors to keep session alive for UI testing
      if (isDevToken) {
        console.warn(`Dev Token: Ignoring error ${status} from server.`);
        return Promise.reject(error);
      }

      switch (status) {
        case 400:
          // alert("Bad Request: Please check your input."); 
          // Do not redirect on 400, just reject so the component can handle it
          break;
        case 401:
          alert("Session Expired: Please log in again.");
          removeTokens();
          window.location.href = "/";
          break;
        case 403:
          alert("Forbidden: You don't have permission.");
          // removeTokens();
          // window.location.href = "/";
          break;
        case 404:
          // alert("Not Found: Requested resource not found.");
          break;
        case 500:
          alert("Server Error: Please try again later.");
          break;
        default:
          alert("Something went wrong. Please try again.");
      }
    } else if (error.request) {
      alert("No response from the server. Please check your internet connection.");
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

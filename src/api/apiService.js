//  global function to  fetch, delete, updata, post
const BASE_URL = "http://127.0.0.1:8080/";

//function to handle API requests
const apiService = async (
  endpoint,
  method = "GET",
  body = null,
  headers = {}
) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Check if the response is not ok (status 200-299), then throw an error
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse the response
    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error; // Re-throw the error to handle it in the calling component
  }
};

// GET Request
export const getData = (endpoint) => apiService(endpoint);

// POST Request
export const postData = (endpoint, data) => apiService(endpoint, "POST", data);

// PUT Request (Update)
export const putData = (endpoint, data) => apiService(endpoint, "PUT", data);

// DELETE Request
export const deleteData = (endpoint) => apiService(endpoint, "DELETE");

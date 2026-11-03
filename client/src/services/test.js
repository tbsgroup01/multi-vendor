import api from "./api";

export async function testApi() {
  try {
    const data = await api.get("/");
    console.log("Server response:", data);
    return data;
  } catch (err) {
    console.error("API error:", err.message);
  }
}

export default testApi;

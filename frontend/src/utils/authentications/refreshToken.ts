const refreshAccessToken = async () => {
	const refreshToken = localStorage.getItem("refresh_token");
	if (!refreshToken) {
	  console.log("No refresh token found. User must log in.");
	  return null;
	}

	try {
	  const response = await fetch("http://127.0.0.1:8000/token_refresh/", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refresh: refreshToken }),
	  });

	  if (response.ok) {
		const data = await response.json();
		localStorage.setItem("access_token", data.access);
		return data.access;
	  } else {
		console.log("Failed to refresh token. User must re-login.");
		return null;
	  }
	} catch (error) {
	  console.error("Error refreshing token:", error);
	  return null;
	}
  };

  export default refreshAccessToken;

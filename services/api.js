const API_HOST = "https://pluto-hotel-server-15c83810c41c.herokuapp.com";

export async function fetchNewBookings(token) {
    try {
        const response = await fetch(`${API_HOST}/api/finalcosting/get`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Fetched data:", JSON.stringify(data, null, 2)); // Removed logging of fetched data
        return data; // Return the raw data
    } catch (error) {
        console.error("Error fetching new bookings:", error.message);
        throw error;
    }
}

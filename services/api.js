const API_HOST = "https://pluto-hotel-server-15c83810c41c.herokuapp.com";

export async function fetchNewBookings(token) {
    try {
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_HOST}/api/cabbooking/get`, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("fetchNewBookings data:", data); // Added log to check itinerary presence
        return data; // Return the raw data
    } catch (error) {
        console.error("Error fetching new bookings:", error.message);
        throw error;
    }
}

export async function updateCabBooking(_id, updateData) {
    try {
        const response = await fetch(`${API_HOST}/api/cabbooking/update/${_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });
        console.log("response", response);
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Update booking API error response text:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating cab booking:", error.message);
        throw error;
    }
}

export async function loginCabUser(email, password) {
    try {
        const response = await fetch(`${API_HOST}/api/cabuser/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "login",
                email,
                password,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Login API error response text:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error logging in cab user:", error.message);
        throw error;
    }
}

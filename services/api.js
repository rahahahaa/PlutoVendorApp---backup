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

// services/api.js
export async function loginCabUser(email, password) {
    const url = `${API_HOST}/api/cabuser/login`;

    console.log("Calling login endpoint:", url);
    console.log("Email:", email);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers]);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Raw error from server:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        let data;
        try {
            data = await response.json(); // Try parsing as JSON
        } catch (e) {
            const text = await response.text();
            console.warn("Response was not JSON", text);
            throw new Error("Server returned invalid JSON");
        }

        console.log("Received from server:", data);
        return data;

    } catch (error) {
        console.error("Login failed:", error.message);
        throw error;
    }
}

export async function signupCabUser(name, email, password, mobile) {
    try {
        const response = await fetch(`${API_HOST}/api/cabuser/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                mobile,
                drivingLicense: "N/A",
                RC: "N/A",
                states: ["default"],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Signup API error response text:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error signing up cab user:", error.message);
        throw error;
    }
}

export async function updateCabUser(id, updateData, token) {
    try {
        const response = await fetch(`${API_HOST}/api/cabuser/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Update cab user API error response text:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating cab user:", error.message);
        throw error;
    }
}

export async function fetchBookingsByStates(states, token) {
    try {
        const query = states.length > 0 ? `?states=${states.join(",")}` : "";
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${API_HOST}/api/cabbooking/get${query}`, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching bookings by states:", error.message);
        throw error;
    }
}

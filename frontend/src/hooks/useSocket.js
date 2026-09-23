import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = (url) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // take token from auth-storage 
        const authData = localStorage.getItem("auth-storage");
        let token = null;

        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                token = parsed?.state?.token;
            } catch (error) {
                console.error("Error parsing auth data:", error);
            }
        }

        if (!token) {
            console.log("No token found. Socket connection skipped.");
            return;
        }

        const newSocket = io(url, {
            transports: ["websocket"],
            auth: { token },
        });

        newSocket.on("connect", () => {
            console.log("Socket connected!");
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket disconnected!");
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [url]);

    return socket;
};

export default useSocket;
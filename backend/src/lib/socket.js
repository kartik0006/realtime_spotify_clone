// import { Server } from "socket.io";
// import { Message } from "../models/message.model.js";

// export const initializeSocket = (server) => {
// 	const io = new Server(server, {
// 		cors: {
// 			origin: "http://localhost:3000",
// 			credentials: true,
// 		},
// 	});

// 	const userSockets = new Map(); // { userId: socketId}
// 	const userActivities = new Map(); // {userId: activity}

// 	io.on("connection", (socket) => {
// 		socket.on("user_connected", (userId) => {
// 			userSockets.set(userId, socket.id);
// 			userActivities.set(userId, "Idle");

// 			// broadcast to all connected sockets that this user just logged in
// 			io.emit("user_connected", userId);

// 			socket.emit("users_online", Array.from(userSockets.keys()));

// 			io.emit("activities", Array.from(userActivities.entries()));
// 		});

// 		socket.on("update_activity", ({ userId, activity }) => {
// 			console.log("activity updated", userId, activity);
// 			userActivities.set(userId, activity);
// 			io.emit("activity_updated", { userId, activity });
// 		});

// 		socket.on("send_message", async (data) => {
// 			try {
// 				const { senderId, receiverId, content } = data;

// 				const message = await Message.create({
// 					senderId,
// 					receiverId,
// 					content,
// 				});

// 				// send to receiver in realtime, if they're online
// 				const receiverSocketId = userSockets.get(receiverId);
// 				if (receiverSocketId) {
// 					io.to(receiverSocketId).emit("receive_message", message);
// 				}

// 				socket.emit("message_sent", message);
// 			} catch (error) {
// 				console.error("Message error:", error);
// 				socket.emit("message_error", error.message);
// 			}
// 		});

// 		socket.on("disconnect", () => {
// 			let disconnectedUserId;
// 			for (const [userId, socketId] of userSockets.entries()) {
// 				// find disconnected user
// 				if (socketId === socket.id) {
// 					disconnectedUserId = userId;
// 					userSockets.delete(userId);
// 					userActivities.delete(userId);
// 					break;
// 				}
// 			}
// 			if (disconnectedUserId) {
// 				io.emit("user_disconnected", disconnectedUserId);
// 			}
// 		});
// 	});
// };
import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: [
				"https://realtime-spotify-clone-n645ymc8g.vercel.app",
				"http://localhost:3000",
				process.env.CORS_ORIGIN
			].filter(Boolean),
			credentials: true,
			methods: ["GET", "POST"]
		},
	});

	const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}

	io.on("connection", (socket) => {
		console.log("🟢 User connected to socket:", socket.id);

		socket.on("user_connected", (userId) => {
			console.log("🔵 User connected event:", userId);
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			// broadcast to all connected sockets that this user just logged in
			io.emit("user_connected", userId);
			socket.emit("users_online", Array.from(userSockets.keys()));
			io.emit("activities", Array.from(userActivities.entries()));
		});

		socket.on("update_activity", ({ userId, activity }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		socket.on("send_message", async (data) => {
			try {
				console.log("📨 Message received in socket:", data);
				const { senderId, receiverId, content } = data;

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});

				console.log("💾 Message saved to DB:", message._id);

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
					console.log("📤 Message sent to receiver:", receiverId);
				} else {
					console.log("❌ Receiver offline:", receiverId);
				}

				// Also send back to sender for confirmation
				socket.emit("message_sent", message);
				console.log("✅ Message confirmation sent to sender");
			} catch (error) {
				console.error("💥 Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			console.log("🔴 User disconnected from socket:", socket.id);
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
// import auth from "../config/firebase-config.js";

// export const VerifyToken = async (req, res, next) => {
//   const token = req.headers.authorization.split(" ")[1];

//   try {
//     const decodeValue = await auth.verifyIdToken(token);
//     if (decodeValue) {
//       req.user = decodeValue;
//       return next();
//     }
//   } catch (e) {
//     return res.json({ message: "Internal Error" });
//   }
// };

// export const VerifySocketToken = async (socket, next) => {
//   const token = socket.handshake.auth.token;

//   try {
//     const decodeValue = await auth.verifyIdToken(token);

//     if (decodeValue) {
//       socket.user = decodeValue;

//       return next();
//     }
//   } catch (e) {
//     return next(new Error("Internal Error"));
//   }
// };
import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }

    return res.status(401).json({
      message: "Unauthorized",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal Error",
    });
  }
};

export const VerifySocketToken = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Token missing"));
    }

    const decodeValue = await auth.verifyIdToken(token);

    if (decodeValue) {
      socket.user = decodeValue;
      return next();
    }

    return next(new Error("Unauthorized"));
  } catch (e) {
    return next(new Error("Internal Error"));
  }
};
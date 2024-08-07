// import { Request, Response, NextFunction } from "express";
// import { ApiError } from "../exceptions/ApiError";

// export const errorHandler = (
//   err: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (err instanceof ApiError) {
//     res.status(err.status).json({ message: err.message });
//     return;
//   }

//   // If the error is not an instance of ApiError, treat it as a 500 error
//   res.status(500).json({ message: "Internal Server Error" });
// };

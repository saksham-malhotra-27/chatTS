// types/express.d.ts
import * as express from 'express';

interface User {
  id:      string,
  name: string,
  profilePic: string,
  profilePicId: string,
  status: string,
  email:   string, 
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust the type according to your needs
    }
  }
}

import { NextFunction, Request, Response } from 'express';


export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const fechaHora = new Date().toLocaleString(); 
  console.log(
    `Estas ejecutando un método ${req.method} en la ruta ${req.url} en la fecha y hora ${fechaHora}`,
  );

  next();
}

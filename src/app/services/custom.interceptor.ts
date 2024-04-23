import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

  const miToken = localStorage.getItem("estaEsLaKey");
  
  const clonRequest = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${miToken}`
    }
  });

  return next(clonRequest);
};

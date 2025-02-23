import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function tokenInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    const clonedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedRequest);
  }
  return next(request);
}
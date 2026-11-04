# Week 6 — Reflection Answers

## 1. Why is DELETE idempotent?

DELETE is idempotent because sending the same request multiple times has the same final result. The first request deletes the event, and later requests do not change anything because the event is already deleted. Even if the second request returns 404, the final state remains the same.

## 2. Why does the browser block a CORS response while curl can still access it?

Browsers enforce the CORS policy to protect users from unauthorized cross-origin requests. If the server does not allow the browser's origin, the browser blocks JavaScript from accessing the response. However, curl is a command-line tool and does not enforce browser CORS restrictions, so it can still access the server response.

## 3. How does NestJS dependency injection work?

NestJS uses dependency injection to create and manage service instances automatically. When a controller needs a service, it declares that service in its constructor. NestJS provides the required instance, allowing the controller to use the service without creating it manually.

## 4. What happens when forbidNonWhitelisted is true or false?

When `forbidNonWhitelisted` is set to `true`, NestJS rejects requests containing properties that are not defined in the DTO and returns a 400 Bad Request error. When it is set to `false`, the `whitelist` option removes unknown properties instead of rejecting the request.

## 5. Why should the seat availability rule be implemented in the service instead of the controller or frontend?

The seat availability rule belongs in the service because it is an important business rule that must always be enforced by the backend. The controller should mainly handle HTTP requests, while the frontend can be bypassed or manipulated by users. Keeping the rule in the service ensures that bookings cannot exceed the event's available capacity.

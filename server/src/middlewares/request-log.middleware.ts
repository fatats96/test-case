import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HttpRequest');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const requestId: string =
      (request.headers['x-request-id'] as string) || this.generateRequestId();

    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const responseTime = Date.now() - startTime;

      const message = `${method} ${originalUrl} ${statusCode} ${responseTime}ms`;

      // Status kodu kontrol et
      if (statusCode >= 500) {
        this.logger.error(
          message,
          `Error: ${response.statusMessage}`,
          `RequestID: ${requestId}`,
          `IP: ${ip}`,
          `UserAgent: ${userAgent}`,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          message,
          `Warning: ${response.statusMessage}`,
          `RequestID: ${requestId}`,
          `IP: ${ip}`,
        );
      } else {
        this.logger.log(message, `RequestID: ${requestId}`);
      }
    });

    response.on('close', () => {
      if (!response.writableEnded) {
        const responseTime = Date.now() - startTime;
        this.logger.warn(
          `${method} ${originalUrl} client closed request after ${responseTime}ms`,
          `RequestID: ${requestId}`,
          `IP: ${ip}`,
        );
      }
    });

    request.headers['x-request-id'] = requestId;

    next();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
}

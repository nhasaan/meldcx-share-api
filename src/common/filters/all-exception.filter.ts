import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // constructor() {} // private readonly sentryClient: SentryService, // @InjectSentry()

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception.getResponse()['message'] ||
      exception.message ||
      'Unknown error';

    const exceptionInfo = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      body: request?.body || null,
      userId: request?.user?._id || null,
    };

    // this.sentryClient.instance().captureException(exception, {
    //   extra: exceptionInfo,
    // });

    response.status(status).json(exceptionInfo);
  }
}

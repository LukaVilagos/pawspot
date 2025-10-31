
import { ConsoleLogger } from '@nestjs/common';

export class PawSpotLogger extends ConsoleLogger {
    error(message: any, stack?: string, context?: string) {
        super.error(message, stack, context);
    }
}

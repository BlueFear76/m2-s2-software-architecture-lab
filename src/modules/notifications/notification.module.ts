import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { AuthModule } from '../shared/auth/auth.module';
import { UserModule } from '../users/user.module';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { SQLiteNotificationRepository } from './infrastructure/repositories/sqlite.notification.repository';
import { GetNotificationsUseCase } from './application/use-cases/get-notifications.use-case';
import { MarkAllNotificationsAsReadUseCase } from './application/use-cases/mark-all-read.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-cases/mark-notification-as-read.use-case';
import { PostStatusChangedHandler } from './application/handlers/post-status-changed.handler';
import { SubscriptionModule } from '../subscriptions/subscription.module';

@Module({
  imports: [
    LoggingModule,
    AuthModule,
    UserModule,
    SubscriptionModule,
  ],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SQLiteNotificationRepository,
    },

    //use Cases
    GetNotificationsUseCase,
    MarkAllNotificationsAsReadUseCase,
    MarkNotificationAsReadUseCase,

    //Handlers
    PostStatusChangedHandler,
  ],
  exports: [NotificationRepository],
})
export class NotificationModule {}
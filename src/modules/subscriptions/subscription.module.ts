import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { AuthModule } from '../shared/auth/auth.module';
import { UserModule } from '../users/user.module';
import { SubscriptionRepository } from './domain/repositories/subscription.repository';
import { SQLiteSubscriptionRepository } from './infrastructure/repositories/subscription.sqlite.repository';
import { SubscriptionController } from './infrastructure/controllers/subscription.controller';

// Use Cases
import { FollowUserUseCase } from './application/use-cases/follow-user.use-case';

@Module({
  imports: [
    LoggingModule,
    AuthModule,
    UserModule
  ],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SubscriptionRepository,
      useClass: SQLiteSubscriptionRepository,
    },
    FollowUserUseCase,
  ],
  exports: [SubscriptionRepository],
})
export class SubscriptionModule {}
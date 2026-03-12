import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';

@Injectable()
export class FollowUserUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(followerId: string, followingId: string): Promise<void> {
    try {
      SubscriptionEntity.create(followerId, followingId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const targetUser = await this.userRepository.getUserById(followingId);
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${followingId} not found`);
    }

    const isAlreadyFollowing = await this.subscriptionRepository.exists(
      followerId, 
      followingId
    );

    if (isAlreadyFollowing) {
      return; // On s'arrête là, pas d'erreur (Idempotent)
    }

    // 4. Création de l'entité et persistance
    const subscription = SubscriptionEntity.create(followerId, followingId);
    await this.subscriptionRepository.save(subscription);
  }
}
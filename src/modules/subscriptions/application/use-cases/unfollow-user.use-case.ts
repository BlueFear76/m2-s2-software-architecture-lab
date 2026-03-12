import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async execute(followerId: string, followingId: string): Promise<void> {
    const isFollowing = await this.subscriptionRepository.exists(followerId, followingId);

    if (!isFollowing) {
      throw new NotFoundException("Vous ne suivez pas cet utilisateur.");
    }

    await this.subscriptionRepository.delete(followerId, followingId);
  }
}   
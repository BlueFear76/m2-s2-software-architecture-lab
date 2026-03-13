import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { SubscriptionRepository } from "../../domain/repositories/subscription.repository";

@Injectable()
export class GetFollowersUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async execute(userId: string, page: number, pageSize: number) {
    const { followers, total } = await this.subscriptionRepository.getFollowers(
      userId, 
      page, 
      pageSize
    );

    return {
      followers: followers.map(f => ({
        id: f.followerId,
        username: `user_${f.followerId.split('-')[0]}`, 
        followedAt: f.createdAt
      })),
      total,
      page,
      pageSize
    };
  }
}
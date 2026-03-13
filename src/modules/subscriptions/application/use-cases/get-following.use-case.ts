import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { SubscriptionRepository } from "../../domain/repositories/subscription.repository";

@Injectable()
export class GetFollowingUseCase {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  public async execute(userId: string, page: number, pageSize: number) {
    const { following, total } = await this.subscriptionRepository.getFollowing(
      userId,
      page,
      pageSize
    );
    return {
      following: following.map((f) => ({
        id: f.followingId,
        username: `user_${f.followingId.split('-')[0]}`, 
        followedAt: f.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }
}
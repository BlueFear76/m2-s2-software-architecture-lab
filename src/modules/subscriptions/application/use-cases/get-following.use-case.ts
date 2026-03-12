import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { SubscriptionRepository } from "../../domain/repositories/subscription.repository";

@Injectable()
export class GetFollowingUseCase {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  public async execute(userId: string): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.getFollowing(userId);
  }
}
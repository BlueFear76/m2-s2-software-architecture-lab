import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { SubscriptionRepository } from "../../domain/repositories/subscription.repository";

@Injectable()
export class GetFollowersUseCase {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  public async execute(userId: string): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.getFollowers(userId);
  }
}
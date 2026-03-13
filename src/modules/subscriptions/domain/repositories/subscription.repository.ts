import { SubscriptionEntity } from "../entities/subscription.entity";

export abstract class SubscriptionRepository {

    public abstract save(subscription: SubscriptionEntity): Promise<void>;

    public abstract delete(followerId: string, followingId: string): Promise<void>;

    public abstract exists(followerId: string, followingId: string): Promise<boolean>;

    public abstract getFollowers(
        userId: string, 
        page: number, 
        pageSize: number
    ): Promise<{ followers: SubscriptionEntity[]; total: number }>;

    public abstract getFollowing(
        userId: string, 
        page: number, 
        pageSize: number
    ): Promise<{ following: SubscriptionEntity[]; total: number }>;
}
import { SubscriptionEntity } from "../entities/subscription.entity";

export abstract class SubscriptionRepository {

    public abstract save(subscription: SubscriptionEntity): Promise<void>;

    public abstract delete(followerId: string, followingId: string): Promise<void>;

    public abstract exists(followerId: string, followingId: string): Promise<boolean>;

    public abstract getFollowers(userId: string): Promise<SubscriptionEntity[]>;

    public abstract getFollowing(userId: string): Promise<SubscriptionEntity[]>;
}
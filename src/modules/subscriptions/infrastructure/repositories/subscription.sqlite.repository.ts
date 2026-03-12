import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SubscriptionRepository } from '../../domain/repositories/subscription.repository';
import { SubscriptionEntity } from '../../domain/entities/subscription.entity';
import { SQLiteSubscriptionEntity } from '../entities/subscription.sqlite.entity';

@Injectable()
export class SQLiteSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly dataSource: DataSource) {}
  
  public async save(subscription: SubscriptionEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .save(subscription.toJSON());
  }

  public async exists(followerId: string, followingId: string): Promise<boolean> {
    const count = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .count({
        where: { followerId, followingId },
      });
    return count > 0;
  }

  public async delete(followerId: string, followingId: string): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .delete({ followerId, followingId });
  }

  public async getFollowers(userId: string): Promise<SubscriptionEntity[]> {
    const relations = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .find({ where: { followingId: userId } });

    return relations.map((rel) => SubscriptionEntity.reconstitute(rel));
  }

  public async getFollowing(userId: string): Promise<SubscriptionEntity[]> {
    const relations = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .find({ where: { followerId: userId } });

    return relations.map((rel) => SubscriptionEntity.reconstitute(rel));
  }
}
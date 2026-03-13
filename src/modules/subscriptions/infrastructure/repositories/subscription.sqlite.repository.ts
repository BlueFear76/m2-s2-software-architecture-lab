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

  public async getFollowers(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ followers: SubscriptionEntity[]; total: number }> {
    const [relations, total] = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .findAndCount({
        where: { followingId: userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' },
      });

    return {
      followers: relations.map((rel) => SubscriptionEntity.reconstitute(rel)),
      total,
    };
  }

  public async getFollowing(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<{ following: SubscriptionEntity[]; total: number }> {
    const [relations, total] = await this.dataSource
      .getRepository(SQLiteSubscriptionEntity)
      .findAndCount({
        where: { followerId: userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: { createdAt: 'DESC' },
      });

    return {
      following: relations.map((rel) => SubscriptionEntity.reconstitute(rel)),
      total,
    };
  }

  public async findAllFollowerIds(followingId: string): Promise<string[]> {
    const repo = this.dataSource.getRepository(SQLiteSubscriptionEntity);
  
    
    const results = await repo.find({
        where: { followingId },
        select: ['followerId']
    });

    return results.map(s => s.followerId);
}
}
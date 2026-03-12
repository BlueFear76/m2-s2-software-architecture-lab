import { Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('subscriptions')
export class SQLiteSubscriptionEntity {
    @PrimaryColumn()
    followerId: string;

    @PrimaryColumn()
    followingId: string;

    @CreateDateColumn()
    createdAt: Date;
}
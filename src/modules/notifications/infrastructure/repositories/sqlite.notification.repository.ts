// src/modules/notifications/infrastructure/repositories/sqlite.notification.repository.ts

import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { DataSource } from "typeorm";
import { NotificationEntity } from "../../domain/entities/notification.entity";
import { SQLiteNotificationEntity } from "../entities/notification.sqlite.entity";

@Injectable()
export class SQLiteNotificationRepository implements NotificationRepository {
  constructor(private readonly dataSource: DataSource) {}


  public async save(notification: NotificationEntity): Promise<void> {
    await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .save(notification.toJSON());
  }


  public async findById(id: string): Promise<NotificationEntity | null> {
    const model = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .findOne({ where: { id } });

    return model ? NotificationEntity.reconstitute(model) : null;
  }


  public async findByRecipient(
    recipientId: string,
    page: number,
    pageSize: number,
    isRead?: boolean
  ): Promise<{ notifications: NotificationEntity[]; total: number; unreadCount: number }> {
    const repo = this.dataSource.getRepository(SQLiteNotificationEntity);

    const whereQuery: any = { recipientId };
    
    if (isRead !== undefined) {
        whereQuery.isRead = isRead;
    }

    const [models, total] = await repo.findAndCount({
      where: whereQuery,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const unreadCount = await repo.count({
      where: { recipientId, isRead: false },
    });

    return {
      notifications: models.map((m) => NotificationEntity.reconstitute(m)),
      total,
      unreadCount,
    };
  }

  public async markAllAsRead(recipientId: string): Promise<number> {
    const result = await this.dataSource
      .getRepository(SQLiteNotificationEntity)
      .update(
        { recipientId, isRead: false }, 
        { isRead: true }
      );

    return result.affected || 0;
  }
}
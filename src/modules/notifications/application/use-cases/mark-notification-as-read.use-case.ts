import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { NotificationEntity } from "../../domain/entities/notification.entity";

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  public async execute(notificationId: string, userId: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    if (notification.recipientId !== userId) {
      throw new ForbiddenException("You are not allowed to mark this notification as read");
    }

    notification.markAsRead();

    await this.notificationRepository.save(notification);

    return notification;
  }
}
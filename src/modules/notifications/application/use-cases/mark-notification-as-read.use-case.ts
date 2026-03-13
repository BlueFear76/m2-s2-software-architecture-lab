import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { NotificationEntity } from "../../domain/entities/notification.entity";

@Injectable()
export class MarkNotificationAsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  public async execute(notificationId: string, userId: string): Promise<NotificationEntity> {
    // 1. Récupération de la notification
    const notification = await this.notificationRepository.findById(notificationId);

    // 2. Vérification de l'existence
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${notificationId} introuvable`);
    }

    // 3. Vérification de propriété (Sécurité)
    // On compare le recipientId de la notif avec l'ID du user connecté
    if (notification.recipientId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à marquer cette notification comme lue");
    }

    // 4. Action métier
    notification.markAsRead();

    // 5. Persistance
    await this.notificationRepository.save(notification);

    return notification;
  }
}
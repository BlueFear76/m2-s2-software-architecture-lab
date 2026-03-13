import { NotificationEntity } from "../entities/notification.entity";

export abstract class NotificationRepository {
    public abstract save(notification: NotificationEntity): Promise<void>;
    
    public abstract findById(id: string): Promise<NotificationEntity | null>;

    public abstract findByRecipient(
        recipientId: string, 
        page: number, 
        pageSize: number,
        isRead?: boolean
    ): Promise<{ notifications: NotificationEntity[]; total: number; unreadCount: number }>;

    public abstract markAllAsRead(recipientId: string): Promise<number>;
}
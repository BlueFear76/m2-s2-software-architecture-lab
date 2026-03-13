import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { v4 as uuidv4 } from 'uuid';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity, NotificationType } from '../../domain/entities/notification.entity';
import { SubscriptionRepository } from 'src/modules/subscriptions/domain/repositories/subscription.repository';
import { LoggingService } from 'src/modules/shared/logging/domain/services/logging.service';

@Injectable()
export class PostStatusChangedHandler {
    constructor(
        private readonly notificationRepository: NotificationRepository,
        private readonly subscriptionRepository: SubscriptionRepository,
        private readonly loggingService: LoggingService,
    ) { }

    @OnEvent('post.status.changed')
    public async handle(payload: {
        postId: string;
        authorId: string;
        title: string;
        status: string;
        link: string;
    }) {
        this.loggingService.log("PostStatusChangedHandler.called");
        if (payload.status === "accepted") {
            const authorNotif = NotificationEntity.create({
                id: uuidv4(),
                recipientId: payload.authorId,
                type: NotificationType.POST_APPROVED,
                title: 'Post approved !',
                message: `Your post "${payload.title}" has been approved.`,
                link: payload.link,
                metadata: { postId: payload.postId }
            });

            this.loggingService.log(authorNotif.recipientId)

            await this.notificationRepository.save(authorNotif);


            const followerIds = await this.subscriptionRepository.findAllFollowerIds(payload.authorId);


            const notificationsToSave = followerIds.map(followerId => {
                const notif = NotificationEntity.create({
                    id: uuidv4(),
                    recipientId: followerId,
                    type: NotificationType.NEW_POST_FROM_FOLLOWED,
                    title: 'New Post',
                    message: `An author you follow has published : ${payload.title}`,
                    link: payload.link
                    ,
                    metadata: { postId: payload.postId, authorId: payload.authorId }
                });
                return this.notificationRepository.save(notif);
            });

            await Promise.all(notificationsToSave);
        }

        else if (payload.status === "rejected") {
            const rejectionNotif = NotificationEntity.create({
                id: uuidv4(),
                recipientId: payload.authorId,
                type: NotificationType.POST_REJECTED,
                title: 'Post rejected',
                message: `Your post "${payload.title}" has been rejected.`,
                link: payload.link,
                metadata: { postId: payload.postId }
            });

            this.loggingService.log(`Sending rejection notice to ${payload.authorId}`);
            await this.notificationRepository.save(rejectionNotif);
        }
    }

    @OnEvent('post.deleted')
    public async handleDeletion(payload: {
        postId: string;
        authorId: string;
        title: string;
    }) {
        this.loggingService.log(`Handling deletion for post: ${payload.title}`);

        const deletionNotif = NotificationEntity.create({
            id: uuidv4(),
            recipientId: payload.authorId,
            type: NotificationType.POST_DELETED,
            title: 'Post deleted',
            message: `Your post "${payload.title}" has been deleted by an administrator.`,
            link: '#', // Le post n'existe plus, donc pas de lien cliquable
            metadata: { postId: payload.postId, deletedAt: new Date().toISOString() }
        });

        await this.notificationRepository.save(deletionNotif);
    }
}


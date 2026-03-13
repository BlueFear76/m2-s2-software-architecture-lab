import { Controller, Get, Post, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { GetNotificationsUseCase } from '../../application/use-cases/get-notifications.use-case';
import { MarkAllNotificationsAsReadUseCase } from '../../application/use-cases/mark-all-read.use-case';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { Requester } from 'src/modules/shared/auth/infrastructure/decorators/requester.decorator';
import { MarkNotificationAsReadUseCase } from '../../application/use-cases/mark-notification-as-read.use-case';

@ApiTags('Notifications')
@Controller('notifications')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(
        private readonly getNotificationsUseCase: GetNotificationsUseCase,
        private readonly markAllReadUseCase: MarkAllNotificationsAsReadUseCase,
        private readonly markNotificationAsReadUseCase: MarkNotificationAsReadUseCase,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Obtenir mes notifications' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'pageSize', required: false, example: 20 })
    @ApiQuery({ name: 'isRead', enum: ['true', 'false', 'all'], required: false, default: 'all' })
    @ApiResponse({
        status: 200,
        description: 'Liste paginée des notifications',
        // Tu peux créer un DTO pour ça, ou mettre un exemple :
        schema: {
            example: {
                notifications: [{ id: "uuid", type: "NEW_COMMENT", title: "...", isRead: false }],
                total: 45,
                unreadCount: 12,
                page: 1,
                pageSize: 20
            }
        }
    })
    public async getMyNotifications(
        @Requester() user: UserEntity,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 20,
        @Query('isRead') isRead: string = 'all'
    ) {
        return await this.getNotificationsUseCase.execute(
            user.id,
            Number(page),
            Number(pageSize),
            isRead
        );
    }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Marquer une notification comme lue' })
    @ApiResponse({ status: 200, description: 'La notification a été marquée comme lue' })
    @ApiResponse({ status: 403, description: 'Cette notification ne vous appartient pas' })
    @ApiResponse({ status: 404, description: 'Notification introuvable' })
    public async markAsRead(
        @Param('id') id: string,
        @Requester() user: UserEntity
    ) {
        return await this.markNotificationAsReadUseCase.execute(id, user.id);
    }

    @Post('mark-all-read')
    @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
    @ApiResponse({
        status: 201,
        description: 'Toutes les notifications ont été marquées comme lues',
        schema: { example: { markedCount: 12 } }
    })
    public async markAllRead(@Requester() user: UserEntity) {
        return await this.markAllReadUseCase.execute(user.id);
    }
}
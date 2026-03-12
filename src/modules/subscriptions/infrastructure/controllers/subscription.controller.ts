import { Controller, Post, Delete, Param, Get, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { Requester } from 'src/modules/shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@Controller('users')
export class SubscriptionController {
    constructor(
        private readonly followUserUseCase: FollowUserUseCase,
    ) { }

    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Suivre un utilisateur' })
    @ApiResponse({ status: 201, description: 'Utilisateur suivi avec succès.' })
    @ApiResponse({ status: 400, description: 'Tentative de se suivre soi-même.' })
    @ApiResponse({ status: 404, description: 'Utilisateur cible non trouvé.' })
    public async follow(
        @Param('id') targetUserId: string,
        @Requester() user: UserEntity,
    ) {
        await this.followUserUseCase.execute(user.id, targetUserId);
        return { message: 'Successfully followed' };
    }
}
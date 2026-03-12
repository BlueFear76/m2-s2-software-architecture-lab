import { Controller, Post, Delete, Param, Get, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FollowUserUseCase } from '../../application/use-cases/follow-user.use-case';
import { Requester } from 'src/modules/shared/auth/infrastructure/decorators/requester.decorator';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';
import { UnfollowUserUseCase } from '../../application/use-cases/unfollow-user.use-case';
import { GetFollowersUseCase } from '../../application/use-cases/get-follower.use-case';
import { GetFollowingUseCase } from '../../application/use-cases/get-following.use-case';

@ApiTags('Subscriptions')
@Controller('users')
export class SubscriptionController {
    constructor(
        private readonly followUserUseCase: FollowUserUseCase,
        private readonly unfollowUserUseCase: UnfollowUserUseCase,
        private readonly getFollowersUseCase: GetFollowersUseCase,
        private readonly getFollowingUseCase: GetFollowingUseCase,
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

    @Delete(':id/unfollow')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @HttpCode(204) // Pas de contenu au retour d'un Delete réussi
    public async unfollow(
        @Param('id') targetUserId: string,
        @Requester() user: UserEntity,
    ) {
        await this.unfollowUserUseCase.execute(user.id, targetUserId);
    }

    @Get(':id/followers')
    @ApiOperation({ summary: 'Obtenir les abonnés d\'un utilisateur' })
    public async getFollowers(@Param('id') userId: string) {
        const followers = await this.getFollowersUseCase.execute(userId);
        return followers.map(f => f.toJSON());
    }

    @Get(':id/following')
    @ApiOperation({ summary: 'Obtenir les abonnements d\'un utilisateur' })
    public async getFollowing(@Param('id') userId: string) {
        const following = await this.getFollowingUseCase.execute(userId);
        return following.map(f => f.toJSON());
    }
}
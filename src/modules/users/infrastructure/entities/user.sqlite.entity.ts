import { Column, Entity, PrimaryColumn } from 'typeorm';
import { type UserRole } from '../../domain/entities/user.entity';

@Entity('users')
export class SQLiteUserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ type: 'varchar', length: 20 })
  role: UserRole;

  @Column()
  password: string;
}

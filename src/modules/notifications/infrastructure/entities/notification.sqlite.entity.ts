import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { NotificationType } from '../../domain/entities/notification.entity';

@Entity('notifications')
export class SQLiteNotificationEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  recipientId: string;

  // On stocke l'enum sous forme de string en base
  @Column({
    type: 'varchar',
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  link: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  /**
   * simple-json permet de stocker des objets/tableaux 
   * dans une colonne texte SQLite de manière transparente.
   */
  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;
}
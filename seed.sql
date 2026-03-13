-- Nettoyage de la base (pour pouvoir relancer le script sans erreur)
PRAGMA foreign_keys = OFF;
DELETE FROM sqlite_user_entity;
DELETE FROM sqlite_tag_entity;
DELETE FROM sqlite_post_entity;
DELETE FROM sqlite_comment_entity;
DELETE FROM sqlite_subscription_entity;
DELETE FROM sqlite_notification_entity;
DELETE FROM post_tags_tag; -- Nom typique de la table de jointure TypeORM
PRAGMA foreign_keys = ON;

-- 1. UTILISATEURS (Writer, Admin, Reader)
INSERT INTO sqlite_user_entity (id, username, role) VALUES (1, 'Elodie_Writer', 'writer');
INSERT INTO sqlite_user_entity (id, username, role) VALUES (2, 'Jean_Admin', 'admin');
INSERT INTO sqlite_user_entity (id, username, role) VALUES (3, 'Lecteur_Curieux', 'user');

-- 2. TAGS
INSERT INTO sqlite_tag_entity (id, name) VALUES (1, 'typescript');
INSERT INTO sqlite_tag_entity (id, name) VALUES (2, 'nodejs');
INSERT INTO sqlite_tag_entity (id, name) VALUES (3, 'clean-architecture');
INSERT INTO sqlite_tag_entity (id, name) VALUES (4, 'nestjs');

-- 3. POSTS (Un post publié par l'auteur id=1)
INSERT INTO sqlite_post_entity (id, title, content, status, authorId) 
VALUES (1, 'Maîtriser la Clean Architecture', 'Contenu passionnant sur NestJS...', 'published', 1);

-- 4. ASSOCIATIONS POST-TAG (Table de jointure)
-- On lie le post 1 aux tags 1 (typescript) et 3 (clean-architecture)
INSERT INTO post_tags_tag (postId, tagId) VALUES (1, 1);
INSERT INTO post_tags_tag (postId, tagId) VALUES (1, 3);

-- 5. COMMENTAIRES
INSERT INTO sqlite_comment_entity (id, content, postId, authorId) 
VALUES (1, 'Super article, très clair !', 1, 3);
INSERT INTO sqlite_comment_entity (id, content, postId, authorId) 
VALUES (2, 'Merci pour le partage.', 1, 2);

-- 6. ABONNEMENT (Le lecteur id=3 suit l'auteur id=1)
INSERT INTO sqlite_subscription_entity (id, followerId, followingId) 
VALUES (1, 3, 1);

-- 7. NOTIFICATIONS (Notification pour l'auteur id=1)
INSERT INTO sqlite_notification_entity (id, message, userId, isRead) 
VALUES (1, 'Vous avez un nouvel abonné !', 1, 0);
INSERT INTO sqlite_notification_entity (id, message, userId, isRead) 
VALUES (2, 'Nouveau commentaire sur votre post.', 1, 0);
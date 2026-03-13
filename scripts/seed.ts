// scripts/seed-complete.ts
import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

console.log('🚀 Seed complète pour TypeORM...');

const dbPath = 'db'; // Ton dossier db
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erreur DB:', err.message);
    process.exit(1);
  }
  console.log('📁 DB connectée:', dbPath);
  
  // ✅ SQLite crée AUTO le fichier s'il n'existe pas
  seedAll();
});

function seedAll() {
  db.serialize(() => {
    // 1. USERS
    const users = [
      { id: '0339aab0-8bdc-4a5e-af85-a2b8851b4819', username: 'gerald', role: 'admin', password: 'gerald' },
      { id: 'e51920eb-0424-419a-ae7f-d49a8172ab27', username: 'reader', role: 'reader', password: 'reader' },
      { id: '18c78962-3281-4bce-9ba3-803335728646', username: 'writer', role: 'writer', password: 'writer' }
    ];

    const userStmt = db.prepare(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        role TEXT NOT NULL,
        password TEXT NOT NULL
      )`
    );
    userStmt.run(); // Crée la table si pas existante
    
    const insertUserStmt = db.prepare(
      `INSERT OR REPLACE INTO users (id, username, role, password) VALUES (?, ?, ?, ?)`
    );
    users.forEach(u => insertUserStmt.run([u.id, u.username, u.role, u.password]));
    insertUserStmt.finalize(() => console.log('✅ 3 users OK'));

    // 2. TAGS
    const tags = [
      { id: 'tag-typescript-1', name: 'typescript' },
      { id: 'tag-nodejs-2', name: 'nodejs' },
      { id: 'tag-javascript-3', name: 'javascript' },
      { id: 'tag-nextjs-4', name: 'nextjs' },
      { id: 'tag-deno-5', name: 'deno' }
    ];

    const tagStmt = db.prepare(
      `CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        createdAt DATETIME
      )`
    );
    tagStmt.run();

    const insertTagStmt = db.prepare(
      `INSERT OR REPLACE INTO tags (id, name, createdAt) VALUES (?, ?, ?)`
    );
    tags.forEach(t => insertTagStmt.run([t.id, t.name, new Date()]));
    insertTagStmt.finalize(() => console.log('✅ 5 tags OK'));

    // 3. POSTS
    const posts = [
      { 
        id: 'post-1', 
        title: 'Mon premier post TypeScript', 
        content: 'Contenu TypeScript génial...',
        status: 'draft',
        authorId: users[0].id,
        slug: 'premier-post-typescript'
      },
      { 
        id: 'post-2', 
        title: 'Node.js performance tips', 
        content: 'Optimisations Node.js...',
        status: 'accepted',
        authorId: users[2].id,
        slug: 'nodejs-performance-tips'
      },
      { 
        id: 'post-3', 
        title: 'Next.js 14 best practices', 
        content: 'Meilleures pratiques Next.js...',
        status: 'published',
        authorId: users[2].id,
        slug: 'nextjs-14-best-practices'
      }
    ];

    const postStmt = db.prepare(
      `CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL,
        authorId TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL
      )`
    );
    postStmt.run();

    const insertPostStmt = db.prepare(
      `INSERT OR REPLACE INTO posts (id, title, content, status, authorId, slug) 
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    posts.forEach(p => insertPostStmt.run([p.id, p.title, p.content, p.status, p.authorId, p.slug]));
    insertPostStmt.finalize(() => console.log('✅ 3 posts OK'));

    // 4. POSTS_TAGS
    db.run(`
      CREATE TABLE IF NOT EXISTS posts_tags (
        post_id TEXT,
        tag_id TEXT,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (tag_id) REFERENCES tags(id)
      )
    `);

    const postTags = [
      ['post-1', 'tag-typescript-1'],
      ['post-1', 'tag-javascript-3'],
      ['post-2', 'tag-nodejs-2'],
      ['post-3', 'tag-nextjs-4'],
      ['post-3', 'tag-typescript-1']
    ];

    const postTagStmt = db.prepare(
      `INSERT OR IGNORE INTO posts_tags (post_id, tag_id) VALUES (?, ?)`
    );
    postTags.forEach(([postId, tagId]) => postTagStmt.run([postId, tagId]));
    postTagStmt.finalize(() => console.log('✅ Associations post-tags OK'));

    // 5. COMMENTS
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        authorId TEXT NOT NULL,
        postId TEXT NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);

    const comments = [
      { 
        id: 'comment-1', 
        content: 'Super article !', 
        authorId: users[1].id,
        postId: 'post-3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        id: 'comment-2', 
        content: 'Merci pour les tips !', 
        authorId: users[0].id, 
        postId: 'post-3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const commentStmt = db.prepare(
      `INSERT OR REPLACE INTO comments (id, content, authorId, postId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?)`
    );
    comments.forEach(c => commentStmt.run([
      c.id, c.content, c.authorId, c.postId, c.createdAt, c.updatedAt
    ]));
    commentStmt.finalize(() => console.log('✅ 2 comments OK'));

    // 6. SUBSCRIPTIONS
    db.run(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        followerId TEXT,
        followingId TEXT,
        createdAt DATETIME,
        PRIMARY KEY (followerId, followingId)
      )
    `);

    const subscriptions = [
      { followerId: users[1].id, followingId: users[2].id }
    ];

    const subStmt = db.prepare(
      `INSERT OR IGNORE INTO subscriptions (followerId, followingId, createdAt) VALUES (?, ?, ?)`
    );
    subscriptions.forEach(s => subStmt.run([s.followerId, s.followingId, new Date()]));
    subStmt.finalize(() => console.log('✅ 1 subscription OK'));

    // 7. NOTIFICATIONS
    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        recipientId TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        link TEXT NOT NULL,
        isRead BOOLEAN DEFAULT 0,
        createdAt DATETIME NOT NULL,
        metadata TEXT
      )
    `);

    const notifications = [
      { 
        id: uuidv4(),
        recipientId: users[2].id,
        type: 'new_comment',
        title: 'Nouveau commentaire',
        message: 'Reader a commenté ton post Next.js',
        link: '/posts/post-3',
        isRead: false,
        metadata: JSON.stringify({ postId: 'post-3', commentId: 'comment-1' })
      },
      { 
        id: uuidv4(),
        recipientId: users[2].id,
        type: 'new_follower',
        title: 'Nouveau follower',
        message: 'Reader te suit maintenant',
        link: '/profile/writer',
        isRead: false,
        metadata: JSON.stringify({ followerId: users[1].id })
      }
    ];

    const notifStmt = db.prepare(
      `INSERT OR REPLACE INTO notifications (id, recipientId, type, title, message, link, isRead, createdAt, metadata) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    notifications.forEach(n => notifStmt.run([
      n.id, n.recipientId, n.type, n.title, n.message, n.link, n.isRead, new Date(), n.metadata
    ]));
    notifStmt.finalize(() => {
      console.log('🎉 SEED COMPLÈTE !');
      db.close();
    });
  });
}

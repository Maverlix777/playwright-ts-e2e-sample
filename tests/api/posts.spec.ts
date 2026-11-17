import { test, expect } from '@playwright/test';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Small hand-written schema checks keep the sample free of extra dependencies.
function isPost(value: unknown): value is Post {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.userId === 'number' &&
    typeof v.id === 'number' &&
    typeof v.title === 'string' &&
    typeof v.body === 'string'
  );
}

function isComment(value: unknown): value is Comment {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.postId === 'number' &&
    typeof v.id === 'number' &&
    typeof v.name === 'string' &&
    typeof v.email === 'string' &&
    typeof v.body === 'string'
  );
}

test.describe('Posts API', () => {
  test('GET /posts returns a list of 100 posts @smoke', async ({ request }) => {
    const response = await request.get('/posts');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const body: unknown = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(100);
  });

  test('GET /posts/1 matches the post schema @smoke', async ({ request }) => {
    const response = await request.get('/posts/1');
    expect(response.ok()).toBe(true);
    const body: unknown = await response.json();
    expect(isPost(body)).toBe(true);
    expect(body).toMatchObject({ id: 1, userId: 1 });
  });

  test('GET /posts/99999 returns 404 @regression', async ({ request }) => {
    const response = await request.get('/posts/99999');
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({});
  });

  test('GET /posts?userId=1 filters by author @regression', async ({ request }) => {
    const response = await request.get('/posts', { params: { userId: 1 } });
    expect(response.status()).toBe(200);
    const posts = (await response.json()) as Post[];
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => isPost(p) && p.userId === 1)).toBe(true);
  });

  test('GET /posts/1/comments returns comments of that post @regression', async ({ request }) => {
    const response = await request.get('/posts/1/comments');
    expect(response.status()).toBe(200);
    const comments = (await response.json()) as Comment[];
    expect(comments.length).toBeGreaterThan(0);
    for (const c of comments) {
      expect(isComment(c)).toBe(true);
      expect(c.postId).toBe(1);
      expect(c.email).toMatch(/^[^@\s]+@[^@\s]+$/);
    }
  });

  test('POST /posts echoes the new post with an id @regression', async ({ request }) => {
    const payload = { userId: 7, title: 'sample title', body: 'sample body' };
    const response = await request.post('/posts', { data: payload });
    expect(response.status()).toBe(201);
    const created = (await response.json()) as Post;
    expect(created).toMatchObject(payload);
    expect(created.id).toBeGreaterThan(100);
  });
});

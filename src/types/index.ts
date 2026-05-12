export interface Post {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content_md: string;
  excerpt: string | null;
  cover_image: string | null;
  published: boolean;
  author_id: string;
  tags: string[] | null;
  read_time_minutes: number | null;
  author?: Author;
}

export interface Author {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
}

export type CreatePostInput = Pick<Post, 'title' | 'slug' | 'content_md' | 'excerpt' | 'cover_image' | 'published' | 'tags'>;
export type UpdatePostInput = Partial<CreatePostInput>;

"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import api from "@/lib/axios";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Post {
  id: string; // UUID
  created_t: string; // ISO timestamp
  updated_t: string; // ISO timestamp
  title: string;
  published_at: string; // ISO timestamp
  url: string;
  description: {
    String: string;
    Valid: boolean;
  };
  feedId: string; // UUID
}

interface Feed {
  id: string;
  name: string;
  url: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_fetched_at: string;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [id, setID] = useState<string>("");
  useEffect(() => {
    async function getParams() {
      const slug = (await params).id;
      setID(slug);
    }
    getParams();
  }, []);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [feed, setFeed] = useState<Feed | null>(null);

  async function getFeed() {
    await api
      .get(`/v1/feed/${id}`)
      .then((res) => setFeed(res.data))
      .catch((err) => setError(err.response.data.error));
  }

  async function getPosts() {
    await api
      .get(`/v1/feed_posts/${id}`)
      .then((res) => setPosts(res.data))
      .catch((err) => setError(err.response.data.error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (id !== "") {
      getFeed();
      getPosts();
    }
  }, [id]);

  if (!error && (id === "" || loading || !feed)) {
    return <Loader className="min-h-[calc(100dvh-4rem)]" size={32} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Error: {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        No posts found
      </div>
    );
  }

  return (
    <div>
      <PostCard title={feed?.name ?? ""} id={feed?.id ?? ""} />
      {posts.map((post, i) => (
        <IndividualPost key={post.id} num={i + 1} {...post} />
      ))}
    </div>
  );
}

function PostCard({ title, id }: { title: string; id: string }) {
  const [exists, setExists] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    async function checkIfExists() {
      await api
        .get(`/v1/feed_follows/check/${id}`)
        .then((res) => {
          setExists(res.data.exists);
        })
        .then(() => setLoading(false))
        .catch((err) => setError(err.response.data.error));
    }

    checkIfExists();
  }, []);

  if (loading) {
    return (
      <div className="h-10 w-full rounded-md bg-secondary animate-pulse my-10" />
    );
  }

  async function UnFollowFeed() {
    await api
      .delete(`/v1/feed_follows/${id}`)
      .then(() => {
        setExists(false);
      })
      .catch((err) => toast.error(err.response.data.error));
  }

  if (exists) {
    return (
      <div className="flex justify-between items-center my-10 flex-wrap">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button size="sm" variant="destructive" onClick={UnFollowFeed}>
          <Heart />
          Unfollow
        </Button>
      </div>
    );
  }

  async function followFeed() {
    await api
      .post(`/v1/feed_follows/${id}`, {})
      .then(() => {
        setExists(true);
      })
      .catch((err) => toast.error(err.response.data.error));
  }

  return (
    <div className="flex justify-between items-center my-10 flex-wrap">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button variant="outline" size="sm" onClick={followFeed}>
        <Heart />
        Follow
      </Button>
    </div>
  );
}

interface PostProps extends Post {
  num: number;
}

function IndividualPost({ num, id, title, url, description }: PostProps) {
  return (
    <a
      href={url}
      className="flex justify-start items-start gap-4 my-6 hover:bg-accent p-2 rounded-md transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 group"
      suppressHydrationWarning
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
        <h1 className="text-gray-500">{num}.</h1>
      </div>
      <div>
        <p className="text-xl font-bold">{title}</p>
        <p className="text-sm text-gray-500">
          {description.Valid ? description.String : "No description"}
        </p>
        <p className="text-sm text-orange-700 group-hover:underline transition-all duration-300">
          {url}
        </p>
      </div>
    </a>
  );
}

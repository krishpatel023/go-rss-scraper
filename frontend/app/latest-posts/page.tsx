"use client";

import Loader from "@/components/ui/loader";
import api from "@/lib/axios";
import { useAuth } from "@/providers/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function Posts() {
  const { isAuthenticated, isLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoadingInternal(true);
      api
        .get("/v1/users/latest_posts")
        .then((res) => res.data)
        .then((data) => setPosts(data))
        .catch((err) => setError(err.message));
      setIsLoadingInternal(false);
    };

    fetchFeeds();
  }, []);

  if (
    isLoading &&
    isLoadingInternal &&
    !isAuthenticated &&
    posts.length === 0 &&
    !error
  ) {
    return <Loader className="min-h-[calc(100dvh-8rem)]" size={32} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100dvh-8rem)] flex flex-col items-center justify-center gap-4">
        <h1>You must be logged in to view this page.</h1>
        <Link
          href="/login"
          className="bg-secondary text-foreground h-10 rounded-md p-3 border border-border flex items-center justify-center"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold my-10">Latest Posts</h1>
      {posts.map((post, i) => (
        <IndividualPost key={post.id} num={i + 1} {...post} />
      ))}
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

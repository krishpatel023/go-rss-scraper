"use client";

import Loader from "@/components/ui/loader";
import api from "@/lib/axios";
import { useAuth } from "@/providers/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Feed {
  id: string;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface FeedProps extends Feed {
  num: number;
}

export default function Feeds() {
  const { isAuthenticated, isLoading } = useAuth();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isLoadingInternal, setIsLoadingInternal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoadingInternal(true);
      api
        .get("/v1/feed_follows")
        .then((res) => res.data)
        .then((data) => setFeeds(data))
        .catch((err) => setError(err.message));
      setIsLoadingInternal(false);
    };

    fetchFeeds();
  }, []);

  if (isLoading && !isAuthenticated && feeds.length === 0 && !error) {
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
    <div className="my-8">
      {isLoadingInternal ? (
        <Loader className="min-h-[calc(100dvh-8rem)]" size={32} />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-8">Feeds You Follow</h1>
          {error && <p>{error}</p>}
          {feeds.map((feed, index) => (
            <Feed key={feed.id} num={index + 1} {...feed} />
          ))}
        </>
      )}
    </div>
  );
}

function Feed({ num, id, name, url }: FeedProps) {
  return (
    <Link
      href={`/feed/${id}`}
      className="flex justify-start items-start gap-4 my-4 hover:bg-accent p-2 rounded-md transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
      suppressHydrationWarning
    >
      <div>
        <p className="text-gray-500">{num}.</p>
      </div>
      <div>
        <p>{name}</p>
        <p className="text-sm text-gray-500">{url}</p>
      </div>
    </Link>
  );
}

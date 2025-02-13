"use client";

import Loader from "@/components/ui/loader";
import api from "@/lib/axios";
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
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoading(true);
      api
        .get("/v1/feeds")
        .then((res) => res.data)
        .then((data) => setFeeds(data))
        .catch((err) => setError(err.message));
      setIsLoading(false);
    };

    fetchFeeds();
  }, []);

  return (
    <div className="my-8">
      {isLoading ? (
        <Loader className="min-h-[calc(100dvh-8rem)]" size={32} />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-8">All Feeds</h1>
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

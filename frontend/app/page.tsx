import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Connect and manage multiple RSS feed sources",
      description:
        "Add any number of RSS feeds from blogs, news sites, and podcasts with automatic feed URL validation and metadata extraction",
    },
    {
      title:
        "Automatic feed synchronization every minute (Limited to 10 feeds at a time but can be increased easily)",
      description:
        "Stay up-to-date with fresh content through our efficient background synchronization system that fetches new articles every minute. This also allows only 10 feeds to be synced at a time but can be increased easily.",
    },
    {
      title: "RESTful API endpoints for feed management",
      description:
        "Well-documented API endpoints for programmatic access to your feeds, enabling integration with other tools and services",
    },
    {
      title: "Efficient PostgreSQL data storage",
      description: "Optimized database schema for fast article retrieval.",
    },
    // {
    //   title: "Full-text search across all articles",
    //   description:
    //     "Powerful search functionality that indexes article titles, content, and metadata for quick content discovery",
    // },
    {
      title: "RSS feed validation and error handling",
      description:
        "Robust error handling system that validates feed formats and maintains feed health monitoring",
    },
    {
      title: "Clean and accessible user interface",
      description: null, // Self-explanatory
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <a
          href="https://github.com/sahil-khatri/rss-feed-scraper"
          className="text-sm mb-8 px-4 py-1 rounded-full bg-primary/10 text-foreground border border-neutral-400 dark:border-neutral-600  hover:underline underline-offset-2 transition-all duration-300"
        >
          Read More About the Details of the Project
        </a>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-center mb-8">
          RSS Feed Scraper & Aggregator
        </h1>
        <p className="text-xl text-center text-muted-foreground mb-8">
          Your personal feed aggregator for staying up-to-date with content that
          matters
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/feeds"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View Feeds
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Project Description */}
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
        <div className="prose prose-neutral dark:prose-invert lg:prose-lg">
          <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight mb-8 underline text-center capitalize">
            About the project and the inspiration
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
            I built this RSS Scraper as a personal project to solve my own need
            for a clean, efficient way to keep track of various blogs, news
            sites, and content creators I follow. Unlike commercial RSS readers,
            this tool focuses on simplicity and speed, letting you aggregate all
            your favorite feeds in one place without the clutter of social
            features or recommendations. It's designed to be a straightforward,
            reliable way to stay informed about the content you choose to
            follow, with features that enhance the reading experience without
            getting in the way.
          </p>
        </div>
      </div>

      {/* Features Checklist */}
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight mb-8 underline text-center">
          Features
        </h2>
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col border rounded-lg p-4 bg-card text-card-foreground shadow-sm"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-foreground font-medium">
                  {feature.title}
                </span>
              </div>
              {feature.description && (
                <p className="text-sm text-muted-foreground mt-2 ml-8">
                  {feature.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

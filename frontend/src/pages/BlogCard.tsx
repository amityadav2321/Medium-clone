

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedDate: string; // unused but kept for structure
}

export const BlogCard = ({
  authorName,
  title,
  content,
}: BlogCardProps) => {
  // Generate random date in the last 30 days
  const now = new Date();
  const randomDaysAgo = Math.floor(Math.random() * 30); // 0–29 days ago
  const randomHours = Math.floor(Math.random() * 24);
  const randomMinutes = Math.floor(Math.random() * 60);

  const randomDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - randomDaysAgo,
    randomHours,
    randomMinutes
  );

  const dateString = randomDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeString = randomDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={authorName} />
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">
            {authorName || "Unknown"}
          </span>{" "}
          • {dateString}
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>

      {/* Content Preview */}
      <p className="text-gray-700 mb-3">
        {content.length > 150 ? content.slice(0, 150) + "..." : content}
      </p>

      {/* Random time at bottom */}
      <div className="text-sm text-gray-500 mt-2">
        Published at {timeString}
      </div>
    </div>
  );
};

function Avatar({ name }: { name?: string }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  return (
    <div
      className="flex items-center justify-center w-8 h-8 bg-gray-200
        rounded-full text-gray-700 font-semibold"
    >
      {initial}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full h-16 mt-auto border-t border-border flex justify-center items-center">
      <p className="text-center text-sm text-muted-foreground">
        Built by{" "}
        <a
          suppressHydrationWarning
          href="#"
          className="font-medium text-primary hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          Krish Patel
        </a>
      </p>
    </footer>
  );
}

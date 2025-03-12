interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export function LoadingButton({
  loading,
  children,
  onClick,
  className = "",
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
          처리 중...
        </>
      ) : (
        children
      )}
    </button>
  );
}

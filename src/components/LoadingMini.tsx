export function LoadingMini() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="space-y-2 text-center">
        <div className="animate-spin h-6 w-6 border-3 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="text-sm text-muted-foreground">잠시만요...</p>
      </div>
    </div>
  );
}

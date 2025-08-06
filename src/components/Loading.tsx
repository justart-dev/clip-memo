export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 space-y-4">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      <div className="text-center space-y-2">
        <h2 className="text-lg font-medium text-foreground">
          잠시만 기다려주세요
        </h2>
        <p className="text-muted-foreground text-sm">
          클립메모가 열심히 준비하고 있어요!
        </p>
      </div>
    </div>
  );
}

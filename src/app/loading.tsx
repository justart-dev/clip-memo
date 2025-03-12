export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="space-y-6 text-center">
        <div className="text-7xl animate-bounce">⚡️</div>
        <div className="space-y-3">
          <h2 className="text-xl font-medium text-foreground">
            잠시만 기다려주세요
          </h2>
          <p className="text-sm text-muted-foreground">
            클립메모가 열심히 준비하고 있어요!
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 rounded-full animate-spin border-primary border-t-transparent" />
        </div>
      </div>
    </div>
  );
}

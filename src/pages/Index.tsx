import Reference2ImageForm from "@/components/Reference2ImageForm";

const Index = () => {
  const handlePointerMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    document.documentElement.style.setProperty("--mx", `${mx}%`);
    document.documentElement.style.setProperty("--my", `${my}%`);
  };

  return (
    <div className="min-h-screen bg-background" onMouseMove={handlePointerMove}>
      <header className="container mx-auto py-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            智能图片生成与搜索
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            参考图生图 + 智能图片搜索，一站式图片解决方案
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <a href="#app" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              图生图
            </a>
            <a href="/api-test" className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
              图片搜索
            </a>
          </div>
        </div>
      </header>

      <main id="app" className="container mx-auto pb-16">
        <Reference2ImageForm />
      </main>
    </div>
  );
};

export default Index;

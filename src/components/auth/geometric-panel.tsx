import { GeometricPattern } from '@/components/icons/geometric-pattern';
import { Logo } from '@/components/icons/logo';

export function GeometricPanel() {
  return (
    <div className="relative hidden h-full flex-col bg-foreground p-10 text-background/80 dark:border-r lg:flex">
      <GeometricPattern />
      <div className="relative z-20">
        <div className="bg-black/50 p-4 rounded-lg inline-block">
          <Logo />
        </div>
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2 bg-black/50 p-6 rounded-lg">
          <p className="text-lg text-primary">
            Your friendly neighbourhood simple task manager
          </p>
        </blockquote>
      </div>
    </div>
  );
}

import { cn } from '../../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('analytics-skeleton', className)} {...props} />;
}

export { Skeleton };

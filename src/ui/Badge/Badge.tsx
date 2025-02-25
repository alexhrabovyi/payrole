import clsx from 'clsx';

interface BadgeProps {
  readonly isPositive: boolean,
  readonly testid?: string,
  readonly children: React.ReactNode,
}

export default function Badge({ isPositive, testid, children }: BadgeProps) {
  const bgColor = isPositive ? 'text-green-100' : 'text-red-100';
  const textColor = isPositive ? 'bg-green-20' : 'bg-red-20';

  return (
    <div
      className={clsx('px-[8px] rounded-[25px] font-tthoves font-medium text-[16px]', bgColor, textColor)}
      data-testid={testid}
    >
      {children}
    </div>
  );
}

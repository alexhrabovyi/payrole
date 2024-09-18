import clsx from 'clsx';

interface BadgeProps {
  isPositive: boolean,
  children: React.ReactNode,
}

const Badge: React.FC<BadgeProps> = ({ isPositive, children }) => {
  const bgColor = isPositive ? 'text-green-100' : 'text-red-100';
  const textColor = isPositive ? 'bg-green-20' : 'bg-red-20';

  return (
    <div className={clsx('px-[8px] rounded-[25px] font-tthoves font-medium text-[16px]', bgColor, textColor)}>
      {children}
    </div>
  );
};

export default Badge;

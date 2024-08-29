interface BadgeProps {
  children: React.ReactNode,
}

const Badge: React.FC<BadgeProps> = ({ children }) => (
  <div className="px-[8px] bg-green-20 rounded-[25px] font-tthoves font-medium text-[16px] text-green-100">
    {children}
  </div>
);

export default Badge;

import SideNav from '../SideNav/SideNav';

interface Props {
  readonly children: React.ReactNode,
}

const LayoutContainer: React.FC<Props> = ({ children }) => (
  <div className="grid grid-cols-[280px_1fr]">
    <div>
      <SideNav />
    </div>
    {children}
  </div>
);

export default LayoutContainer;

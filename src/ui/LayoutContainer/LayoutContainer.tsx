import SideNav from '../SideNav/SideNav';

interface Props {
  readonly children: React.ReactNode,
}

const LayoutContainer: React.FC<Props> = ({ children }) => (
  // <div className="grid grid-cols-[280px_1fr]">
  <div className="grid grid-cols-[1fr] xl:grid-cols-[minmax(220px,_14.58%)_1fr]">
    <SideNav />
    {/* <div>
      <SideNav />
    </div> */}
    {children}
  </div>
);

export default LayoutContainer;

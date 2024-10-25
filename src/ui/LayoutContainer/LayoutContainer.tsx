import SideNav from '../SideNav/SideNav';

interface Props {
  readonly children: React.ReactNode,
}

const LayoutContainer: React.FC<Props> = ({ children }) => {
  const PX_FROM_WHICH_STATIC_BEHAVIOUR = 1280;

  return (
    <div className="w-full grid grid-cols-[1fr] xl:grid-cols-[minmax(220px,_14.58%)_1fr]">
      <SideNav
        pxFromWhichStaticBehaviour={PX_FROM_WHICH_STATIC_BEHAVIOUR}
      />
      {children}
    </div>
  );
};

export default LayoutContainer;

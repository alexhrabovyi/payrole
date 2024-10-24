import SideNav from '../SideNav/SideNav';

interface Props {
  readonly children: React.ReactNode,
}

const LayoutContainer: React.FC<Props> = ({ children }) => {
  const PX_FROM_WHICH_STATIC_BEHAVIOUR = 1280;
  const MIN_WIDTH_IN_PX = 220;
  const WIDTH_IN_PERCENT = 14.58;

  return (
    <div className={`w-full grid grid-cols-[1fr] xl:grid-cols-[minmax(${MIN_WIDTH_IN_PX}px,_${WIDTH_IN_PERCENT}%)_1fr]`}>
      <SideNav
        pxFromWhichStaticBehaviour={PX_FROM_WHICH_STATIC_BEHAVIOUR}
        minWidthInPx={MIN_WIDTH_IN_PX}
        widthInPercent={WIDTH_IN_PERCENT}
      />
      {children}
    </div>
  );
};

export default LayoutContainer;

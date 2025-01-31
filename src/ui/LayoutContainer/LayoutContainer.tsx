import SideNav from '../SideNav/SideNav';

interface LayoutContainerProps {
  readonly children: React.ReactNode,
}

export default function LayoutContainer({ children }: LayoutContainerProps) {
  const PX_FROM_WHICH_STATIC_BEHAVIOUR = 1280;

  return (
    <div className="w-full grid grid-cols-[1fr] xl:grid-cols-[minmax(220px,_14.58%)_1fr]">
      <SideNav
        pxFromWhichStaticBehaviour={PX_FROM_WHICH_STATIC_BEHAVIOUR}
      />
      {children}
    </div>
  );
}

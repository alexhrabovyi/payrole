interface ContainerProps {
  readonly children: React.ReactNode | React.ReactNode[],
}

const PageContainer: React.FC<ContainerProps> = ({ children }) => (
  <div className="px-[24px] pb-[195px] flex flex-col justify-start items-start gap-[24px]">
    {children}
  </div>
);

export default PageContainer;

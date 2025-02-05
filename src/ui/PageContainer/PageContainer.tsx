interface ContainerProps {
  readonly children: React.ReactNode | React.ReactNode[],
}

export default function PageContainer({ children }: ContainerProps) {
  return (
    <div className="w-full px-[24px] pb-[160px] 2xl:pb-[195px] flex flex-col justify-start items-start gap-[24px]">
      {children}
    </div>
  );
}

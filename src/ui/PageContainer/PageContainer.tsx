interface ContainerProps {
  readonly children: React.ReactNode | React.ReactNode[],
}

export default function PageContainer({ children }: ContainerProps) {
  return (
    <div className="w-full px-[18px] min-[500px]:px-[24px] pb-[80px] sm:pb-[100px] md:pb-[120px] lg:pb-[140px]
      xl:pb-[160px] 2xl:pb-[195px] flex flex-col justify-start items-start gap-[24px]"
    >
      {children}
    </div>
  );
}

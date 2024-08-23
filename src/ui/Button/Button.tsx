import { forwardRef } from 'react';

type Ref = HTMLButtonElement;

interface ButtonProps {
  children: React.ReactNode | React.ReactNode[],
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  classNames?: string | string[],
}

const Button = forwardRef<Ref, ButtonProps>(
  ({ children, type = 'button', classNames }, ref) => {
    let className = `p-[12px_20px] flex justify-start items-center gap-[12px] rounded-[100px]
        bg-blue hover:bg-blue-hover active:bg-blue-active font-tthoves text-[14px] 
        font-medium text-white hover:text-white-hover active:text-white-active transition-standart`;

    if (classNames instanceof Array) {
      className += ` ${classNames.join(' ')}`;
    } else if (classNames) {
      className += ` ${classNames}`;
    }

    return (
      <button
        type={type}
        ref={ref}
        className={className}
      >
        {children}
      </button>
    );
  },
);

export default Button;

import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';

interface BurgerButtonProps {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
}

const BurgerButton: React.FC<BurgerButtonProps> = ({ isOpen, setIsOpen }) => (
  <button
    type="button"
    className="w-[55px] h-[55px] stroke-darkBlue hover:stroke-blue-hover active:stroke-blue-active"
    onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
  >
    <svg className="w-full h-auto" viewBox="0 0 100 100">
      <path
        className={clsx(
          `fill-none stroke-[8px] 
          [transition:stroke-dasharray_600ms_cubic-bezier(0.4,0,0.2,1),stroke-dashoffset_600ms_cubic-bezier(0.4,0,0.2,1),stroke_150ms_ease-in-out]`,
          isOpen ? '[stroke-dasharray:_90_207] [stroke-dashoffset:_-134]' : '[stroke-dasharray:_60_207]',
        )}
        d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"
      />
      <path
        className={clsx(
          `fill-none stroke-[8px] 
          [transition:stroke-dasharray_600ms_cubic-bezier(0.4,0,0.2,1),stroke-dashoffset_600ms_cubic-bezier(0.4,0,0.2,1),stroke_150ms_ease-in-out]`,
          isOpen ? '[stroke-dasharray:_1_60] [stroke-dashoffset:_-30]' : '[stroke-dasharray:_60_60]',
        )}
        d="M 20,50 H 80"
      />
      <path
        className={clsx(
          `fill-none stroke-[8px] 
          [transition:stroke-dasharray_600ms_cubic-bezier(0.4,0,0.2,1),stroke-dashoffset_600ms_cubic-bezier(0.4,0,0.2,1),stroke_150ms_ease-in-out]`,
          isOpen ? '[stroke-dasharray:_90_207] [stroke-dashoffset:_-134]' : '[stroke-dasharray:_60_207]',
        )}
        d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"
      />
    </svg>
  </button>
);

export default BurgerButton;

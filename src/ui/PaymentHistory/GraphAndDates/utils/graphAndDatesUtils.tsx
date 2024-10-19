import { FormattedPaymentStats } from '../../PaymentHistory';
import { FillProps, StatsWithCoords, StrokeProps, SvgMetrics } from '../GraphAndDates';

export type AmountType = 'negative' | 'positive';

export interface CalcNextAdditionalCoordsProps {
  currentX: number,
  nextX: number,
  currentAmount: number,
  nextAmount: number,
  zeroLineYCoord: number,
}

export interface AddGraphPathsProps {
  pathsArr: React.ReactNode[],
  color: 'colorGreen' | 'colorRed',
  strokeStr: string,
  fillStr: string,
}

export interface PrevAdditionalCoords {
  x: number,
  y: number,
}

export interface MinMaxAmount {
  minAmount: number,
  maxAmount: number,
}

export interface MinMaxCoords {
  minYCoord: number,
  maxYCoord: number,
  minXCoord: number,
  maxXCoord: number,
}

export interface XYStepsType {
  XStep: number,
  YStep: number,
}

export function calcXCoord(indexInArray: number, Xstep: number) {
  return indexInArray * Xstep;
}

export function calcYCoord(
  currentAmount: number,
  minAmount: number,
  Ystep: number,
  maxYCoord: number,
) {
  return Math.abs((currentAmount - minAmount) * Ystep - maxYCoord);
}

export function calcNextAdditionalCoords(props: CalcNextAdditionalCoordsProps) {
  const {
    currentX,
    nextX,
    currentAmount,
    nextAmount,
    zeroLineYCoord,
  } = props;

  const ABSAmountSum = Math.abs(currentAmount) + Math.abs(nextAmount);
  const currentAmountPercent = Math.abs(currentAmount) / ABSAmountSum;

  const additionalCoordX = currentX + (nextX - currentX) * currentAmountPercent;
  const additionalCoordY = zeroLineYCoord;

  return {
    x: additionalCoordX,
    y: additionalCoordY,
  };
}

export function calcMinMaxAmount(paymentStats: FormattedPaymentStats[]): MinMaxAmount {
  const allAmounts = paymentStats.map((p) => p.amount);
  const minAmount = Math.min(...allAmounts);
  const maxAmount = Math.max(...allAmounts);

  return {
    minAmount,
    maxAmount,
  };
}

export function calcMinMaxCoords(
  topIndentPx: number,
  bottomIndentPercent: number,
  svgMetrics: SvgMetrics | undefined,
): MinMaxCoords | undefined {
  if (!svgMetrics) return;

  const minYCoord = topIndentPx;
  const maxYCoord = svgMetrics.height * (1 - bottomIndentPercent);
  const minXCoord = 0;
  const maxXCoord = svgMetrics.width;

  return {
    minYCoord,
    maxYCoord,
    minXCoord,
    maxXCoord,
  };
}

export function createStatsWithCoords(
  paymentStats: FormattedPaymentStats[],
  minMaxAmount: MinMaxAmount,
  minMaxCoords: MinMaxCoords | undefined,
  XYSteps: XYStepsType | undefined,
) {
  if (!minMaxCoords || !XYSteps) return;

  const { minAmount } = minMaxAmount;
  const { maxYCoord } = minMaxCoords;
  const { XStep, YStep } = XYSteps;

  const newStatsCoords: StatsWithCoords[] = paymentStats
    .map((s, i) => ({
      ...s,
      x: calcXCoord(i, XStep),
      y: calcYCoord(s.amount, minAmount, YStep, maxYCoord),
    }));

  return newStatsCoords;
}

export function calcXYSteps(
  minMaxAmount: MinMaxAmount,
  minMaxCoords: MinMaxCoords | undefined,
  daysAmount: number,
): XYStepsType | undefined {
  if (!minMaxCoords) return;

  const { minXCoord, maxXCoord, minYCoord, maxYCoord } = minMaxCoords;
  const { minAmount, maxAmount } = minMaxAmount;

  const XStep = (maxXCoord - minXCoord) / (daysAmount - 1);
  const YStep = (maxYCoord - minYCoord) / (maxAmount - minAmount);

  return {
    XStep,
    YStep,
  };
}

export function checkAmountType(amount: number): AmountType {
  return amount >= 0 ? 'positive' : 'negative';
}

export function startPath(x: number, y: number) {
  return `M ${x} ${y}`;
}

export function isZeroLineNeeded(
  currentAmountType: AmountType,
  isNextAdditionalCoordsNeeded: boolean,
  isLast: boolean,
  isPrevCoordsExist: boolean,
) {
  if (currentAmountType === 'negative' && (isNextAdditionalCoordsNeeded || (isLast && isPrevCoordsExist))) {
    return true;
  }

  return false;
}

export function drawAndAddZeroLinePath(
  pathsArr: React.ReactNode[],
  zeroLineY: number,
  x1: number,
  x2: number,
) {
  pathsArr.push(
    <path
      key={`zeroLine${x1}${x2}`}
      d={`M ${x1} ${zeroLineY} L ${x2} ${zeroLineY}`}
      fill="none"
      strokeWidth="2"
      stroke="#CACACE"
      strokeDasharray="5,5"
    />,
  );
}

export function addGraphPaths(
  strokeProps: StrokeProps,
  fillProps: FillProps,
  props: AddGraphPathsProps,
) {
  const { pathsArr, color, strokeStr, fillStr } = props;

  pathsArr.push(
    <path
      key={strokeStr}
      d={strokeStr}
      fill="none"
      strokeWidth={strokeProps.width}
      stroke={strokeProps[color]}
      strokeLinejoin={strokeProps.linejoin}
      strokeLinecap={strokeProps.strokeLinecap}
    />,
    <path
      key={fillStr}
      d={fillStr}
      fill={fillProps[color]}
      stroke="none"
      opacity={fillProps.opacity}
    />,
  );
}

export function createGraphElems(
  statsWithCoords: StatsWithCoords[] | undefined,
  minMaxAmount: MinMaxAmount,
  minMaxCoords: MinMaxCoords | undefined,
  XYSteps: XYStepsType | undefined,
  strokeProps: StrokeProps,
  fillProps: FillProps,
) {
  if (!minMaxCoords || !XYSteps || !statsWithCoords) return;

  const { minAmount } = minMaxAmount;
  const { minXCoord, maxXCoord, maxYCoord } = minMaxCoords;
  const { YStep } = XYSteps;

  const daysAmount = statsWithCoords.length;

  const zeroLineYCoord = calcYCoord(0, minAmount, YStep, maxYCoord);

  const newGraphElems: React.ReactNode[] = [];
  let dStrokeStr: string;
  let prevAdditionalCoords: PrevAdditionalCoords;

  statsWithCoords.forEach((s, i) => {
    const prevStatsAmount = statsWithCoords[i - 1]?.amount;
    const currenStatsAmount = s.amount;
    const nextStatsAmount = statsWithCoords[i + 1]?.amount;

    const currentAmountType = checkAmountType(currenStatsAmount);

    const { x: currentX, y: currentY } = s;
    const color = currentAmountType === 'positive' ? 'colorGreen' : 'colorRed';

    if (i === 0) {
      dStrokeStr = startPath(currentX, currentY);

      const nextAmountType = checkAmountType(nextStatsAmount);
      const isNextAdditionalCoordsNeeded = currentAmountType !== nextAmountType;

      if (isNextAdditionalCoordsNeeded) {
        const { x: nextX } = statsWithCoords[i + 1];

        const { x: additionalCoordX, y: additionalCoordY } = calcNextAdditionalCoords({
          currentX,
          nextX,
          currentAmount: currenStatsAmount,
          nextAmount: nextStatsAmount,
          zeroLineYCoord,
        });

        dStrokeStr += ` L ${additionalCoordX} ${additionalCoordY}`;
        const dFillStr = `${dStrokeStr} L ${minXCoord} ${zeroLineYCoord} Z`;

        if (isZeroLineNeeded(
          currentAmountType,
          isNextAdditionalCoordsNeeded,
          false,
          !!prevAdditionalCoords,
        )) {
          drawAndAddZeroLinePath(newGraphElems, zeroLineYCoord, minXCoord, additionalCoordX);
        }

        addGraphPaths(
          strokeProps,
          fillProps,
          {
            pathsArr: newGraphElems,
            color,
            strokeStr: dStrokeStr,
            fillStr: dFillStr,
          },
        );

        prevAdditionalCoords = {
          x: additionalCoordX,
          y: additionalCoordY,
        };
      }
    } else if (i === daysAmount - 1) {
      const prevAmountType = checkAmountType(prevStatsAmount);
      const isPrevAdditionalCoordsUsed = !!prevAdditionalCoords;
      const isNextAdditionalCoordsNeeded = false;

      if (prevAmountType !== currentAmountType) {
        dStrokeStr = startPath(prevAdditionalCoords.x, prevAdditionalCoords.y);
      }

      dStrokeStr += ` L ${currentX} ${currentY}`;
      let dFillStr = `${dStrokeStr} L ${maxXCoord} ${zeroLineYCoord}`;

      if (isPrevAdditionalCoordsUsed) {
        dFillStr += ' Z';
      } else {
        dFillStr += ` L ${minXCoord} ${zeroLineYCoord} Z`;
      }

      if (isZeroLineNeeded(
        currentAmountType,
        isNextAdditionalCoordsNeeded,
        true,
        !!prevAdditionalCoords,
      )) {
        drawAndAddZeroLinePath(newGraphElems, zeroLineYCoord, prevAdditionalCoords.x, maxXCoord);
      }

      addGraphPaths(
        strokeProps,
        fillProps,
        {
          pathsArr: newGraphElems,
          color,
          strokeStr: dStrokeStr,
          fillStr: dFillStr,
        },
      );
    } else {
      const prevAmountType = checkAmountType(prevStatsAmount);
      const nextAmountType = checkAmountType(nextStatsAmount);
      const isPrevAdditionalCoordsUsed = prevAmountType !== currentAmountType;
      const isNextAdditionalCoordsNeeded = currentAmountType !== nextAmountType;

      if (isPrevAdditionalCoordsUsed) {
        dStrokeStr = startPath(prevAdditionalCoords.x, prevAdditionalCoords.y);
      }

      dStrokeStr += ` L ${currentX} ${currentY}`;

      if (isNextAdditionalCoordsNeeded) {
        const { x: nextX } = statsWithCoords[i + 1];

        const { x: additionalCoordX, y: additionalCoordY } = calcNextAdditionalCoords({
          currentX,
          nextX,
          currentAmount: currenStatsAmount,
          nextAmount: nextStatsAmount,
          zeroLineYCoord,
        });

        dStrokeStr += ` L ${additionalCoordX} ${additionalCoordY}`;
        let dFillStr = dStrokeStr;

        if (!prevAdditionalCoords) {
          dFillStr += ` L ${minXCoord} ${zeroLineYCoord} Z`;
        } else {
          dFillStr += ' Z';
        }

        if (isZeroLineNeeded(
          currentAmountType,
          isNextAdditionalCoordsNeeded,
          false,
          !!prevAdditionalCoords,
        )) {
          drawAndAddZeroLinePath(
            newGraphElems,
            zeroLineYCoord,
            prevAdditionalCoords?.x || minXCoord,
            additionalCoordX,
          );
        }

        addGraphPaths(
          strokeProps,
          fillProps,
          {
            pathsArr: newGraphElems,
            color,
            strokeStr: dStrokeStr,
            fillStr: dFillStr,
          },
        );

        prevAdditionalCoords = {
          x: additionalCoordX,
          y: additionalCoordY,
        };
      }
    }
  });

  return newGraphElems;
}

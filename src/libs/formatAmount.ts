export default function formatAmount(a: number) {
  let isNegative = false;
  let formatedAmount: string | string[] = a.toString().split('').reverse();

  if (formatedAmount[formatedAmount.length - 1] === '-') {
    formatedAmount.pop();
    isNegative = true;
  }

  let shift = 0;

  for (let i = 1; i < formatedAmount.length; i += 1) {
    if (i % 3 === 0 && formatedAmount[i + shift]) {
      formatedAmount.splice(i + shift, 0, ',');
      shift += 1;
    }
  }

  if (isNegative) {
    formatedAmount.push('-');
  }

  formatedAmount = formatedAmount.reverse().join('');

  return formatedAmount;
}

import localFont from 'next/font/local';

const TTHovesFont = localFont(
  {
    src: [
      {
        path: './TTHoves/TTHoves-Regular.woff',
        weight: '400',
        style: 'normal',
      },
      {
        path: './TTHoves/TTHoves-Medium.woff',
        weight: '500',
        style: 'normal',
      },
      {
        path: './TTHoves/TTHoves-DemiBold.woff',
        weight: '600',
        style: 'normal',
      },
      {
        path: './TTHoves/TTHoves-Bold.woff',
        weight: '700',
        style: 'normal',
      },
    ],
    display: 'swap',
    variable: '--font-tthoves',
  },
);

export default TTHovesFont;

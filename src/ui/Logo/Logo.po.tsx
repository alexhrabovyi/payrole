import { screen } from '@testing-library/dom';

const LogoPO = {
  getLogo() {
    return screen.getByTestId('navLogo');
  },
};

export default LogoPO;

// Credentials are published on https://www.saucedemo.com itself.
export const PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: PASSWORD },
  lockedOut: { username: 'locked_out_user', password: PASSWORD },
} as const;

export const customer = {
  firstName: 'Test',
  lastName: 'Buyer',
  postalCode: '98101',
} as const;

export const products = {
  backpack: 'sauce-labs-backpack',
  bikeLight: 'sauce-labs-bike-light',
} as const;

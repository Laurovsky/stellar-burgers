import { TConstructorIngredient, TIngredient } from '@utils-types';

export const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '/bun.png',
  image_large: '/bun-large.png',
  image_mobile: '/bun-mobile.png'
};

export const filling: TConstructorIngredient = {
  ...bun,
  _id: 'main-1',
  id: 'instance-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  price: 424
};

export const secondFilling: TConstructorIngredient = {
  ...filling,
  id: 'instance-2'
};

export const orderResponse = {
  success: true,
  name: 'Тестовый бургер',
  order: {
    _id: 'order-1',
    number: 12345,
    name: 'Тестовый бургер',
    status: 'done',
    createdAt: '2026-01-01T12:00:00.000Z',
    updatedAt: '2026-01-01T12:00:00.000Z',
    price: 2934,
    owner: {
      name: 'Тестовый пользователь',
      email: 'test@example.com',
      createdAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z'
    }
  }
};

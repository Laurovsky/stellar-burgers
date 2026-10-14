import constructorReducer, {
  addIngredients,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
  setBun
} from './constructorSlice';
import { createOrderThunk } from './orderSlice';
import {
  bun,
  filling,
  secondFilling,
  orderResponse
} from './__tests__/fixtures';

const filledState = () => ({ bun, ingredients: [filling, secondFilling] });

describe('burgerConstructor reducer', () => {
  test('возвращает начальное состояние для undefined и UNKNOWN', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
    const state = filledState();
    expect(constructorReducer(state, { type: 'UNKNOWN' })).toBe(state);
  });

  test('устанавливает булку', () => {
    expect(constructorReducer(undefined, setBun(bun))).toEqual({
      bun,
      ingredients: []
    });
  });

  test('заменяет булку, сохраняя начинку', () => {
    const replacement = { ...bun, _id: 'bun-2', name: 'Другая булка' };
    expect(constructorReducer(filledState(), setBun(replacement))).toEqual({
      bun: replacement,
      ingredients: [filling, secondFilling]
    });
  });

  test('добавляет начинку в пустой конструктор', () => {
    expect(constructorReducer(undefined, addIngredients(filling))).toEqual({
      bun: null,
      ingredients: [filling]
    });
  });

  test('добавляет повторный ингредиент с отдельным id в конец', () => {
    const state = { bun, ingredients: [filling] };
    expect(constructorReducer(state, addIngredients(secondFilling))).toEqual(
      filledState()
    );
    expect(state.ingredients).toEqual([filling]);
  });

  test('удаляет только экземпляр с указанным id', () => {
    expect(
      constructorReducer(filledState(), removeIngredient(filling.id))
    ).toEqual({ bun, ingredients: [secondFilling] });
  });

  test('не удаляет ингредиенты, если id не найден', () => {
    expect(
      constructorReducer(filledState(), removeIngredient('missing'))
    ).toEqual(filledState());
  });

  test('перемещает ингредиент вверх', () => {
    const state = filledState();
    expect(constructorReducer(state, moveIngredientUp(1))).toEqual({
      bun,
      ingredients: [secondFilling, filling]
    });
    expect(state.ingredients).toEqual([filling, secondFilling]);
  });

  test('не перемещает первый ингредиент вверх', () => {
    expect(constructorReducer(filledState(), moveIngredientUp(0))).toEqual(
      filledState()
    );
  });

  test('перемещает ингредиент вниз', () => {
    expect(constructorReducer(filledState(), moveIngredientDown(0))).toEqual({
      bun,
      ingredients: [secondFilling, filling]
    });
  });

  test('не перемещает последний ингредиент вниз', () => {
    expect(constructorReducer(filledState(), moveIngredientDown(1))).toEqual(
      filledState()
    );
  });

  test('очищает булку и начинку после успешного создания заказа', () => {
    const state = filledState();
    expect(
      constructorReducer(
        state,
        createOrderThunk.fulfilled(orderResponse, 'request-id', [
          bun._id,
          filling._id,
          bun._id
        ])
      )
    ).toEqual({ bun: null, ingredients: [] });
    expect(state).toEqual(filledState());
  });

  test('сохраняет бургер во время создания заказа', () => {
    expect(
      constructorReducer(
        filledState(),
        createOrderThunk.pending('request-id', [])
      )
    ).toEqual(filledState());
  });

  test('сохраняет бургер при ошибке создания заказа', () => {
    expect(
      constructorReducer(
        filledState(),
        createOrderThunk.rejected(new Error('Ошибка заказа'), 'request-id', [])
      )
    ).toEqual(filledState());
  });
});

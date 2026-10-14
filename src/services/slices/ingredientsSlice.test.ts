import ingredientsReducer, { getIngredientsThunk } from './ingredientsSlice';
import { bun, filling } from './__tests__/fixtures';

describe('ingredients reducer', () => {
  test.each([
    { name: 'пустой список', ingredients: [] },
    { name: 'загруженный список', ingredients: [bun] }
  ])('pending включает загрузку и очищает ошибку: $name', ({ ingredients }) => {
    const state = { ingredients, isLoading: false, error: 'Старая ошибка' };
    expect(
      ingredientsReducer(state, getIngredientsThunk.pending('request-id'))
    ).toEqual({ ingredients, isLoading: true, error: null });
  });

  test('заменяет ингредиенты, выключает загрузку и очищает ошибку при fulfilled', () => {
    const state = { ingredients: [bun], isLoading: true, error: 'Ошибка' };
    const ingredients = [filling];
    expect(
      ingredientsReducer(
        state,
        getIngredientsThunk.fulfilled(ingredients, 'request-id')
      )
    ).toEqual({ ingredients, isLoading: false, error: null });
    expect(state.ingredients).toEqual([bun]);
  });

  test('принимает пустой массив при fulfilled', () => {
    expect(
      ingredientsReducer(
        { ingredients: [bun], isLoading: true, error: null },
        getIngredientsThunk.fulfilled([], 'request-id')
      )
    ).toEqual({ ingredients: [], isLoading: false, error: null });
  });

  test('сохраняет ингредиенты и записывает ошибку при rejected', () => {
    expect(
      ingredientsReducer(
        { ingredients: [bun], isLoading: true, error: null },
        getIngredientsThunk.rejected(new Error('Нет соединения'), 'request-id')
      )
    ).toEqual({
      ingredients: [bun],
      isLoading: false,
      error: 'Нет соединения'
    });
  });

  test('использует сообщение по умолчанию, если rejected не содержит message', () => {
    const action = getIngredientsThunk.rejected(null, 'request-id');
    action.error = {};
    expect(ingredientsReducer(undefined, action).error).toBe(
      'Произошла ошибка'
    );
  });

  test('возвращает начальное состояние для неизвестного экшена', () => {
    const result = ingredientsReducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });
});

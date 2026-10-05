import ingredientsReducer, { getIngredientsThunk } from './ingredientsSlice';

describe('ingredients reducer', () => {
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

  test('включает загрузку при начале запроса ингредиентов', () => {
    const state = {
      ingredients: [],
      isLoading: false,
      error: 'Старая ошибка'
    };

    const action = getIngredientsThunk.pending('request-id', undefined);

    const result = ingredientsReducer(state, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });
});

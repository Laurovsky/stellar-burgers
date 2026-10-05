import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredients, setBun } from '../../services/slices/constructorSlice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      }
      if (ingredient.type !== 'bun') {
        dispatch(addIngredients({ ...ingredient, id: uuid() }));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);

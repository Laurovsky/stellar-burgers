import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  profileOrdersThunk,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersIsLoading
} from '../../services/slices/profileOrdersSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersIsLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(profileOrdersThunk());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};

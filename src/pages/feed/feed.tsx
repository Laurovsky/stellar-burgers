import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedsThunk,
  selectFeedsError,
  selectFeedsIsLoading,
  selectFeedsOrders
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const isLoading = useSelector(selectFeedsIsLoading);
  const error = useSelector(selectFeedsError);
  const orders = useSelector(selectFeedsOrders);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeedsThunk());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeedsThunk());
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

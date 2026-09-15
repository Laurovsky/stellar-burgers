import { ConstructorPage, Feed, ForgotPassword, Login, NotFound404, Profile, ProfileOrders, Register, ResetPassword } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo, ProtectedRoute } from '@components';
import { Preloader } from '@ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';


const App = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const navigate = useNavigate();

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
      <div className={styles.app}>
        <AppHeader />

        <Routes location={backgroundLocation || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/login' element={<ProtectedRoute><Login /></ProtectedRoute>} />
          <Route path='/register' element={<ProtectedRoute><Register /></ProtectedRoute>} />
          <Route path='/forgot-password' element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
          <Route path='/reset-password' element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/profile/orders/:number' element={<ProtectedRoute><OrderInfo /></ProtectedRoute>} />
          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {backgroundLocation &&
          <Routes>  
            <Route 
              path='/feed/:number' 
              element={
                <Modal title='' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              } 
            />
            <Route 
              path='/ingredients/:id' 
              element={
                <Modal title='' onClose={handleCloseModal}>
                  <IngredientDetails />
                </Modal>
              } 
            />
            <Route 
              path='/profile/orders/:number' 
              element={
                <ProtectedRoute>
                  <Modal title='' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              } 
            />
          </Routes>
        }
      </div>
  );
};

export default App;

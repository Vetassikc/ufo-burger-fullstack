import { Suspense } from 'react';
import OrderSuccessContent from './OrderSuccessContent';

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
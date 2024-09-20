import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { themeConfigSlice } from "./features/themeConfig/themeConfigSlice";
import { deliverySlice } from "./features/delivery/deliverySlice";
import { firmSlice } from "./features/firm/firmSlice";
import { materialSlice } from "./features/material/materialSlice";
import { productSlice } from "./features/product/productSlice";
import { productionSlice } from "./features/production/productionSlice";
import { purchaseSlice } from "./features/purchase/purchaseSlice";
import { saleSlice } from "./features/sale/saleSlice";
import { userSlice } from "./features/user/userSlice";
import { vehicleSlice } from "./features/vehicle/vehicleSlice";


const rootReducer = combineSlices(themeConfigSlice, deliverySlice, firmSlice, materialSlice, productSlice, productionSlice, purchaseSlice, saleSlice, userSlice, vehicleSlice);

export type RootState = ReturnType<typeof rootReducer>;

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    // middleware: (getDefaultMiddleware) => {
    //   return getDefaultMiddleware().concat(quotesApiSlice.middleware);
    // },
  });
};

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

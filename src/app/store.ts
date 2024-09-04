import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import webReducer from './webSlice'
import { usersApi } from '../page/[role]/(manager)/user/UsersEndpoints'
import { categoryAttributesApi } from '../page/[role]/(manager)/attribute/_components/category_attribute/CategoryAttributeEndpoints'
import { attributesApi } from '../page/[role]/(manager)/attribute/_components/attribute/AttributeEndpoints'
import { addressApi } from '../utils/addressRTKQuery'

import bannerSlice from './slices/bannerSlice'
import categorySlice from './slices/categorySlice'
import { valueAttributesApi } from '../page/[role]/(manager)/attribute/_components/value_attribute/ValueAttributeEndPoints'
import postCategorySlice from './slices/postCategorySlice'
import { privilegeGroupApi } from '@/page/[role]/(manager)/privilege/_components/privilege_group/PrivilegeGroupEndpoint'
import { privilegeApi } from '@/page/[role]/(manager)/privilege/_components/privilege/PrivilegeEndpoint'
import { privilegeUsersApi } from '@/page/[role]/(manager)/user/PrivilegeUsersEndpoints'
import postSlice from './slices/postSlice'
import authSlice from './slices/authSlide'
import { categoriesApi } from '@/page/[role]/(manager)/category/CategoryEndpoints'
import { productsApi } from '@/page/[role]/(manager)/products/ProductsEndpoints'
import { brandsApi } from '@/page/[role]/(manager)/brand/BrandEndpoints'
import { bannersApi } from '@/page/[role]/(manager)/banner/BannerEndpoints'
import { CartsApi } from '@/services/CartEndPoinst'
import { ordersApi } from '@/services/OrderEndPoints'
import cartSlide from './slices/cartSlide'
import { voucherApi } from '@/page/[role]/(manager)/voucher/VoucherEndpoint'
import { CommentsApi } from '@/services/CommentEndPoints'
import { statisticalApi } from '@/page/[role]/(manager)/dashboard/StatisticalEnpoint'
import { detailsApi } from '@/page/[role]/(manager)/details/_component/DetailsEndpoints'
import { galleryApi } from './endPoint/GalleryEndPoint'
import { detailApi } from './endPoint/DetailEndPoint'

export const store = configureStore({
  reducer: {
    web: webReducer,
    banner: bannerSlice,
    //category: categorySlice,
    postCategory: postCategorySlice,
    post: postSlice,
    auth: authSlice,
    carts:cartSlide,
    [usersApi.reducerPath]: usersApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [attributesApi.reducerPath]: attributesApi.reducer,
    [categoryAttributesApi.reducerPath]: categoryAttributesApi.reducer,
    [valueAttributesApi.reducerPath] : valueAttributesApi.reducer,
    [privilegeGroupApi.reducerPath] : privilegeGroupApi.reducer,
    [privilegeApi.reducerPath] : privilegeApi.reducer,
    [privilegeUsersApi.reducerPath] : privilegeUsersApi.reducer,
    [productsApi.reducerPath] : productsApi.reducer,
    [categoriesApi.reducerPath] : categoriesApi.reducer,
    [brandsApi.reducerPath] : brandsApi.reducer,
    [bannersApi.reducerPath] : bannersApi.reducer,
    [CartsApi.reducerPath] : CartsApi.reducer,
    [ordersApi.reducerPath] : ordersApi.reducer,
    [voucherApi.reducerPath] : voucherApi.reducer,
    [CommentsApi.reducerPath] : CommentsApi.reducer,
    [statisticalApi.reducerPath] : statisticalApi.reducer,
    [detailsApi.reducerPath] : detailsApi.reducer,
    [galleryApi.reducerPath] : galleryApi.reducer,
    [detailApi.reducerPath]: detailApi.reducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  middleware: (getDefaultMiddleware) => //attributesApi.middleware
  getDefaultMiddleware({ serializableCheck: false }).concat(
    usersApi.middleware, 
    addressApi.middleware, 
    attributesApi.middleware, 
    categoryAttributesApi.middleware, 
    valueAttributesApi.middleware, 
    privilegeGroupApi.middleware, 
    privilegeApi.middleware, 
    privilegeUsersApi.middleware, 
    productsApi.middleware, 
    categoriesApi.middleware, 
    brandsApi.middleware, 
    bannersApi.middleware, 
    CartsApi.middleware, 
    ordersApi.middleware, 
    voucherApi.middleware, 
    CommentsApi.middleware, 
    statisticalApi.middleware, 
    detailsApi.middleware,
    galleryApi.middleware,
    detailApi.middleware
  ),
});


export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

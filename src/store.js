import { configureStore } from '@reduxjs/toolkit';

import brandsReducer from './slices/brands-slice';
import modelsReducer from './slices/models-slice';
import ratingsReducer from './slices/ratings-slice';
import galleriesReducer from './slices/galleries-slice';
import specsReducer from './slices/specs-slice';

export default configureStore({
    reducer: {
        brands: brandsReducer,
        models: modelsReducer,
        ratings: ratingsReducer,
        galleries: galleriesReducer,
        specs: specsReducer,
    },
});

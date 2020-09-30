import axios from 'axios';
import { batch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

export const brandsSlice = createSlice({
    name: 'brands',
    initialState: {
        isLoading: false,
        current: null,
        brands: [],
        models: [],
        total: 0,
        errors: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setBrands: (state, action) => {
            state.brands = action.payload.brands;
            state.total = action.payload.total;
        },
        setModels: (state, action) => {
            state.models = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
    },
});

export const { setLoading, setBrands, setModels, setErrors } = brandsSlice.actions;

export const fetchBrands = (page, size, filters) => async (dispatch) => {
    dispatch(setLoading(true));
    const { data: { brands, total } } = await axios.get('/api/brands', {
        params: {
            page,
            size,
            filters,
        },
    });
    batch(() => {
        dispatch(setBrands({
            brands,
            total,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const fetchBrand = id => async (dispatch) => {
    dispatch(setLoading(true));

    const { data: models } = await axios.get('/api/brands/models');

    let brand = null;
    if (id != null && id !== 'new') {
        ({ data: brand } = await axios.get(`/api/brands/${id}`));
    }

    batch(() => {
        if (brand != null) {
            dispatch(setBrands({
                brands: [brand],
                total: 1,
            }));
        }
        dispatch(setModels(models));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const saveBrand = (id, brandData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        let brand = null;
        if (id == null || id === 'new') {
            ({ data: brand } = await axios.post('/api/brands', brandData));
        } else {
            ({ data: brand } = await axios.put(`/api/brands/${id}`, brandData));
        }
        batch(() => {
            dispatch(setBrands({
                brands: [brand],
                total: 1,
            }));
            dispatch(setErrors([]));
            dispatch(setLoading(false));
        });
        return brand.id;
    } catch (err) {
        const { data } = err.response || { data: { message: err.message } };
        batch(() => {
            dispatch(setErrors(data.message.split('\n')));
            dispatch(setLoading(false));
        });
        return null;
    }
};

export const removeBrand = id => async (dispatch) => {
    dispatch(setLoading(true));
    await axios.delete(`/api/brands/${id}`);
    batch(() => {
        dispatch(setBrands({
            brands: [],
            total: 0,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export default brandsSlice.reducer;

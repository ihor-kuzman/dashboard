import axios from 'axios';
import { batch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

export const modelsSlice = createSlice({
    name: 'models',
    initialState: {
        isLoading: false,
        current: null,
        brands: [],
        models: [],
        ratings: [],
        total: 0,
        errors: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setBrands: (state, action) => {
            state.brands = action.payload;
        },
        setModels: (state, action) => {
            state.models = action.payload.models;
            state.total = action.payload.total;
        },
        setRatings: (state, action) => {
            state.ratings = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
    },
});

export const { setLoading, setBrands, setModels, setRatings, setErrors } = modelsSlice.actions;

export const fetchModels = (page, size, filters) => async (dispatch) => {
    dispatch(setLoading(true));

    const { data: brands } = await axios.get('/api/models/brands');
    const { data: { models, total } } = await axios.get('/api/models', {
        params: {
            page,
            size,
            filters,
        },
    });

    batch(() => {
        dispatch(setBrands(brands));
        dispatch(setModels({
            models,
            total,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const fetchModel = id => async (dispatch) => {
    dispatch(setLoading(true));

    const { data: brands } = await axios.get('/api/models/brands');
    const { data: ratings } = await axios.get('/api/models/ratings');

    let model = null;
    if (id != null && id !== 'new') {
        ({ data: model } = await axios.get(`/api/models/${id}`));
    }

    batch(() => {
        dispatch(setBrands(brands));
        if (model != null) {
            dispatch(setModels({
                models: [model],
                total: 1,
            }));
        }
        dispatch(setRatings(ratings));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const saveModel = (id, modelData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        let model = null;
        if (id == null || id === 'new') {
            ({ data: model } = await axios.post('/api/models', modelData));
        } else {
            ({ data: model } = await axios.put(`/api/models/${id}`, modelData));
        }
        batch(() => {
            dispatch(setModels({
                models: [model],
                total: 1,
            }));
            dispatch(setErrors([]));
            dispatch(setLoading(false));
        });
        return model.id;
    } catch (err) {
        const { data } = err.response || { data: { message: err.message } };
        batch(() => {
            dispatch(setErrors(data.message.split('\n')));
            dispatch(setLoading(false));
        });
        return null;
    }
};

export const removeModel = id => async (dispatch) => {
    dispatch(setLoading(true));
    await axios.delete(`/api/models/${id}`);
    batch(() => {
        dispatch(setModels({
            models: [],
            total: 0,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export default modelsSlice.reducer;

import axios from 'axios';
import { batch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

export const specsSlice = createSlice({
    name: 'specs',
    initialState: {
        isLoading: false,
        current: null,
        models: [],
        specs: [],
        total: 0,
        errors: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setSpecs: (state, action) => {
            state.specs = action.payload.specs;
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

export const { setLoading, setSpecs, setModels, setErrors } = specsSlice.actions;

export const fetchSpecs = (page, size, filters) => async (dispatch) => {
    dispatch(setLoading(true));
    const { data: { specs, total } } = await axios.get('/api/specs', {
        params: {
            page,
            size,
            filters,
        },
    });
    batch(() => {
        dispatch(setSpecs({
            specs,
            total,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const fetchSpec = id => async (dispatch) => {
    dispatch(setLoading(true));

    const { data: models } = await axios.get('/api/specs/models');

    let spec = null;
    if (id != null && id !== 'new') {
        ({ data: spec } = await axios.get(`/api/specs/${id}`));
    }

    batch(() => {
        if (spec != null) {
            dispatch(setSpecs({
                specs: [spec],
                total: 1,
            }));
        }
        dispatch(setModels(models));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const saveSpec = (id, specData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        let spec = null;
        if (id == null || id === 'new') {
            ({ data: spec } = await axios.post('/api/specs', specData));
        } else {
            ({ data: spec } = await axios.put(`/api/specs/${id}`, specData));
        }
        batch(() => {
            dispatch(setSpecs({
                specs: [spec],
                total: 1,
            }));
            dispatch(setErrors([]));
            dispatch(setLoading(false));
        });
        return spec.id;
    } catch (err) {
        const { data } = err.response || { data: { message: err.message } };
        batch(() => {
            dispatch(setErrors(data.message.split('\n')));
            dispatch(setLoading(false));
        });
        return null;
    }
};

export const removeSpec = id => async (dispatch) => {
    dispatch(setLoading(true));
    await axios.delete(`/api/specs/${id}`);
    batch(() => {
        dispatch(setSpecs({
            specs: [],
            total: 0,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export default specsSlice.reducer;

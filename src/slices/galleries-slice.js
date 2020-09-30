import axios from 'axios';
import { batch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

export const galleriesSlice = createSlice({
    name: 'galleries',
    initialState: {
        isLoading: false,
        current: null,
        models: [],
        galleries: [],
        total: 0,
        errors: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setGalleries: (state, action) => {
            state.galleries = action.payload.galleries;
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

export const { setLoading, setGalleries, setModels, setErrors } = galleriesSlice.actions;

export const fetchGalleries = (page, size, filters) => async (dispatch) => {
    dispatch(setLoading(true));
    const { data: { galleries, total } } = await axios.get('/api/galleries', {
        params: {
            page,
            size,
            filters,
        },
    });
    batch(() => {
        dispatch(setGalleries({
            galleries,
            total,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const fetchGallery = id => async (dispatch) => {
    dispatch(setLoading(true));

    const { data: models } = await axios.get('/api/galleries/models');

    let gallery = null;
    if (id != null && id !== 'new') {
        ({ data: gallery } = await axios.get(`/api/galleries/${id}`));
    }

    batch(() => {
        if (gallery != null) {
            dispatch(setGalleries({
                galleries: [gallery],
                total: 1,
            }));
        }
        dispatch(setModels(models));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const saveGallery = (id, galleryData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        let gallery = null;
        if (id == null || id === 'new') {
            ({ data: gallery } = await axios.post('/api/galleries', galleryData));
        } else {
            ({ data: gallery } = await axios.put(`/api/galleries/${id}`, galleryData));
        }
        batch(() => {
            dispatch(setGalleries({
                galleries: [gallery],
                total: 1,
            }));
            dispatch(setErrors([]));
            dispatch(setLoading(false));
        });
        return gallery.id;
    } catch (err) {
        const { data } = err.response || { data: { message: err.message } };
        batch(() => {
            dispatch(setErrors(data.message.split('\n')));
            dispatch(setLoading(false));
        });
        return null;
    }
};

export const removeGallery = id => async (dispatch) => {
    dispatch(setLoading(true));
    await axios.delete(`/api/galleries/${id}`);
    batch(() => {
        dispatch(setGalleries({
            galleries: [],
            total: 0,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export default galleriesSlice.reducer;

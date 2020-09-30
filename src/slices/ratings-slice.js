import axios from 'axios';
import { batch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';

export const ratingsSlice = createSlice({
    name: 'ratings',
    initialState: {
        isLoading: false,
        current: null,
        ratings: [],
        models: [],
        total: 0,
        errors: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setRatings: (state, action) => {
            state.ratings = action.payload.ratings;
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

export const { setLoading, setRatings, setModels, setErrors } = ratingsSlice.actions;

export const fetchRatings = (page, size, filters) => async (dispatch) => {
    dispatch(setLoading(true));
    const { data: { ratings, total } } = await axios.get('/api/ratings', {
        params: {
            page,
            size,
            filters,
        },
    });
    batch(() => {
        dispatch(setRatings({
            ratings,
            total,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const fetchRating = id => async (dispatch) => {
    dispatch(setLoading(true));

    const { data: models } = await axios.get('/api/ratings/models');

    let rating = null;
    if (id != null && id !== 'new') {
        ({ data: rating } = await axios.get(`/api/ratings/${id}`));
    }

    batch(() => {
        if (rating != null) {
            dispatch(setRatings({
                ratings: [rating],
                total: 1,
            }));
        }
        dispatch(setModels(models));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export const saveRating = (id, ratingData) => async (dispatch) => {
    dispatch(setLoading(true));
    try {
        let rating = null;
        if (id == null || id === 'new') {
            ({ data: rating } = await axios.post('/api/ratings', ratingData));
        } else {
            ({ data: rating } = await axios.put(`/api/ratings/${id}`, ratingData));
        }
        batch(() => {
            dispatch(setRatings({
                ratings: [rating],
                total: 1,
            }));
            dispatch(setErrors([]));
            dispatch(setLoading(false));
        });
        return rating.id;
    } catch (err) {
        const { data } = err.response || { data: { message: err.message } };
        batch(() => {
            dispatch(setErrors(data.message.split('\n')));
            dispatch(setLoading(false));
        });
        return null;
    }
};

export const removeRating = id => async (dispatch) => {
    dispatch(setLoading(true));
    await axios.delete(`/api/ratings/${id}`);
    batch(() => {
        dispatch(setRatings({
            ratings: [],
            total: 0,
        }));
        dispatch(setErrors([]));
        dispatch(setLoading(false));
    });
};

export default ratingsSlice.reducer;

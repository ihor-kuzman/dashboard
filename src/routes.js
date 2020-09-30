import { lazy } from 'react';

export default [
    {
        path: '/admin/brands/:id',
        exact: true,
        component: lazy(() => import('./pages/brands/brands-edit')),
    },
    {
        path: '/admin/brands',
        exact: true,
        component: lazy(() => import('./pages/brands/brands-list')),
    },

    {
        path: '/admin/models/:id',
        exact: true,
        component: lazy(() => import('./pages/models/models-edit')),
    },
    {
        path: '/admin/models',
        exact: true,
        component: lazy(() => import('./pages/models/models-list')),
    },

    {
        path: '/admin/ratings/:id',
        exact: true,
        component: lazy(() => import('./pages/ratings/ratings-edit')),
    },
    {
        path: '/admin/ratings',
        exact: true,
        component: lazy(() => import('./pages/ratings/ratings-list')),
    },

    {
        path: '/admin/galleries/:id',
        exact: true,
        component: lazy(() => import('./pages/galleries/galleries-edit')),
    },
    {
        path: '/admin/galleries',
        exact: true,
        component: lazy(() => import('./pages/galleries/galleries-list')),
    },

    {
        path: '/admin/specs/:id',
        exact: true,
        component: lazy(() => import('./pages/specs/specs-edit')),
    },
    {
        path: '/admin/specs',
        exact: true,
        component: lazy(() => import('./pages/specs/specs-list')),
    },

    {
        path: '/admin/settings',
        exact: true,
        component: lazy(() => import('./pages/settings')),
    },

    {
        path: '/admin',
        exact: true,
        component: lazy(() => import('./pages/home')),
    },

    {
        component: lazy(() => import('./pages/not-found')),
    },
];

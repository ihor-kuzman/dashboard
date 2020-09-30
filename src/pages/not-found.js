import React from 'react';
import { Link } from 'react-router-dom';

import Wrapper from '../components/wrapper';

export default function NotFound() {
    return (
        <Wrapper
            title="Not found"
        >
            <Link to="/admin">Go to Home</Link>
        </Wrapper>
    );
}

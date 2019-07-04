import React from 'react';
import Select from 'react-select';

import { TransComponent } from 'my-components'

export const renderError = props => {
    const {touched, error, warning } = props.meta
    return (
        error && <span {...props} className='error'><TransComponent i18nKey={error} /></span> || null
    )
}

export const renderSelectField = props => {
    const { input, options } = props;
    const {touched, error, warning } = props.meta
    return (
        <Select
            {...input}
            {...props}
            onChange={value => input.onChange(value)}
            onBlur={() => input.onBlur(input.value)}
            options={options}
        />
    )
}

export const renderFormatGroupLabel = data => (
    <div style={{fontWeight: 'bold', fontSize: '14px', color: '#333'}}>
        <span>{data.label}</span>
    </div>
);
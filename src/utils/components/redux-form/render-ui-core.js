import React, { Fragment } from 'react';

export const renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...otherProps
}) => {
    let properties = {
        type: otherProps.type || "text",
        error: !!(touched && error),
        value: input.value,
        onChange: input.onChange,
        className: "form-control"
    };

    return (
        <div className={`form-group ${error ? 'has-error' : ''}`} style={{ display: 'flex' }}>
           <label className="col-md-3 control-label">{label}</label>
           <div className="col-md-9">
                <input  {...properties} error={properties.error ? true : null} />
                {touched && error && <span className="help-block">{error}</span> }
            </div>
        </div>
    )
};
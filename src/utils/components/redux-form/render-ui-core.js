import React from 'react';

export const renderTextField = ({
    input: { value, onChange, onBlur, onFocus },
    label,
    meta: { touched, error, warning },
    ...otherProps
}) => {
    let properties = {
        type: otherProps.type || "text",
        error: !!(touched && error) ? '' : null,
        value,
        onChange,
        onBlur,
        onFocus,
        className: "form-control",
    };

    return (
        <div className={`form-group ${(touched && (error || warning)) ? 'has-error' : ''}`} style={{ display: 'flex' }}>
           <label className="col-md-3 control-label">{label}</label>
           <div className="col-md-9">
                <input  {...properties} />
               {touched && ((error && <span className="help-block">{error}</span>) || (warning && <span className="help-block">{warning}</span>))}
            </div>
        </div>
    )
};
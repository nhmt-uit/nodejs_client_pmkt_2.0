import React from 'react';
import { TransComponent } from 'my-components';

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
            { label ? <label className="col-md-3 control-label">{label}</label> : null }
           <div style={label ? {} : { paddingLeft: 0, paddingRight: 0 }} className={`col-md-${ label ? '9' : '12' }`}>
                <input  {...properties} placeholder={otherProps.placeholder} />
               {touched && ((error && <span className="help-block"><TransComponent i18nKey={error} /></span>) || (warning && <span className="help-block"><TransComponent i18nKey={warning} /></span>))}
           </div>
        </div>
    )
};
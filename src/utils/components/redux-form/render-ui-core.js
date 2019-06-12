import React from 'react';
// import TextField from 'material-ui/TextField';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/Select';
import MenuItem from 'material-ui/MenuItem';
// import TinyMCE from 'my-utils/components/editor/TinyMCE';

export const renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}) => {
    let properties = {
        type: "text",
        error: (touched && error? true: false),
        value: input.value,
        onChange: input.onChange,
        margin: "normal",
        fullWidth: true,
    }

    return (
        <div>
            <TextField
                {...properties}
            />
            {touched && error && <FormHelperText error id="name-error-text">{error}</FormHelperText>}
        </div>
    )
};

export const renderCheckbox = ({ input, label }) => (
    <Checkbox
        label={label}
        checked={input.value ? true : false}
        onCheck={input.onChange}
    />
);

export const renderRadioGroup = ({ input, ...rest }) => (
    <RadioButtonGroup
        {...input}
        {...rest}
        valueSelected={input.value}
        onChange={(event, value) => input.onChange(value)}
    />
);

export const renderSelectField = ({
    input,
    label,
    meta: { touched, error },
    children,
    ...custom
}) => (
    <SelectField
        floatingLabelText={label}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => input.onChange(value)}
        children={children}
        {...custom}
    />
);

// // tinymce editor
// export const renderEditor = ({
//     input,
//     meta: { touched, error },
//     children,
//     ...custom
// }) => (
//     <div>
//         <TinyMCE
//             {...input}
//             content={input.value}
//             // initialValues={input.value}
//             onChange={(e) =>  input.onChange(e)}
//             children={children}
//             {...custom}
//         />
//         {
//             touched &&
//             ((error && <span className="error" >{error}</span>))
//         }
//     </div>
// );

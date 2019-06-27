import React from 'react';
import {
    TextField,
    Checkbox,
    Radio, RadioGroup,
    FormHelperText,
    InputLabel,
    Select,
    FormControl,
    FormControlLabel
} from '@material-ui/core';

// import TinyMCE from 'my-utils/components/editor/TinyMCE';

const styles = {
    noLabel: {
        marginTop: '0'
    },
    selectNoLabel: {
        marginTop: 0,
        marginBottom: 8
    }
};

export const renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}) => {
    let properties = {
        type: custom.type,
        error: (touched && error? true: false),
        value: input.value,
        onChange: input.onChange,
        margin: "normal",
        fullWidth: true,
        label: label,
        multiline: custom.multiline,
        rows: custom.rows,
    }

    return (
        <div>
            <TextField
                {...properties}
                style={!label ? styles.noLabel : {}}
            />
            {touched && error && <FormHelperText error>{error}</FormHelperText>}
        </div>
    )
};

export const renderSelectField = ({
    input,
    label,
    meta: { touched, error },
    children,
    ...custom
}) => {
    return (
        <FormControl style={{display: 'block'}}>
            {label && <InputLabel error={(touched && error? true: false)}>{label}</InputLabel>}
            <Select
                error={(touched && error? true: false)}
                value={input.value}
                onChange={event => input.onChange(event.target.value)}
                children={children}
                {...custom}
                style={!label ? styles.selectNoLabel : {marginBottom: 8}}
                inputProps={{
                    name: input.name,
                    id: input.name
                }}
                autoWidth={custom.fullWidth}
            />
            {touched && error && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
    )
};

export const renderCheckbox = ({ input, label }) => (
    <Checkbox
        label={label}
        checked={input.value ? true : false}
        onCheck={input.onChange}
    />
);

export const renderRadioGroup = ({
    input,
    children,
    meta: { touched, error },
    ...rest,
}) => {
    return (
        <div>
            <RadioGroup
                {...input}
                // {...rest}
                // children={children}
                value={input.value}
                onChange={(event, value) => input.onChange(value)}
                style={rest.style}
                className={rest.className}
            >
                {
                    children.map(function(item, key) {
                        return (<FormControlLabel key={key} {...item.props} />)
                    })

                }
            </RadioGroup>
            {touched && error && <FormHelperText error>{error}</FormHelperText>}
        </div>
    );
};

// tinymce editor
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

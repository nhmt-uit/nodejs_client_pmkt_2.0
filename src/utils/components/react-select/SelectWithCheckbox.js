import React, { Component } from 'react';
import ReactSelect, { components } from 'react-select';
import { sortBy, isEqual } from 'lodash'

let selectAll = false;
const Menu = ({ children, selectProps, ...otherProps }) => (
    <components.Menu {...otherProps}>
        {!selectProps.inputValue
            && (
                <section>
                    <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(el) => {
                            let opts = selectProps.options;
                            if (!el.target.checked) opts = null
                            selectProps.onChange(opts)
                        }}
                    /> <label>Select All</label>
                </section>
            )}
        {children}
    </components.Menu>
);

const Option = selectProps => (
    <components.Option {...selectProps}>
        <input
            type="checkbox"
            checked={selectProps.isSelected}
            onChange={() => null}
        />
        <label>{selectProps.label}</label>
    </components.Option>
);

export default class SelectWithCheckbox extends Component {
    handleChange = value => {
        const { onChange } = this.props;
        onChange(value);
    };

    render() {
        const { options, value, isMulti, ...props } = this.props;
        selectAll = isEqual(sortBy(options, ['value']),sortBy(value, ['value'])) ? true : false
        return (
            <ReactSelect
                components={isMulti && { Menu, Option }}
                options={options}
                value={value}
                onChange={this.handleChange}
                isMulti={isMulti}
                hideSelectedOptions={!isMulti}
                closeMenuOnSelect={!isMulti}
                {...props}
            />
        );
    }
}
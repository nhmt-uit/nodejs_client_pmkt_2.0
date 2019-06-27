
import { join, filter } from 'lodash'

export default renderOption = ({ checked, option, onClick }) => (
    <label className="mt-checkbox uppercase">
        <input type="checkbox" checked={checked} onChange={onClick} /> {option.label}
        <span></span>
    </label>
)

export default renderValue = (selected, options) => {
    let label = 'Select the member'
    if (selected.length) {
        let labels = []
        for (let x in selected) {
            
            let check = filter(options, ['value', selected[x]]);
            labels.push(check[0].label)
        }
        label = join(labels, ", ")
    }
    return <span className="uppercase" style={{'color': 'ccc'}}>{label}</span>
}
export const filterOption = (value, option) => {
    const optionValue = option.props.children.toLowerCase();
    return optionValue.includes(value.toLowerCase());
};
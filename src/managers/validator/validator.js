export const validator = (target, reg, helpText) => {
    const { value } = target;
    if (!value) {
        return { status: false, message: 'Заполните поле' };
    }
    if (!(new RegExp(reg).test(value))) {
        return { status: false, message: `${helpText}` };
    }
    return { status: true };
};

import { IModel } from 'store/interfaces';

export abstract class Model<TModel = IModel> {
    public attrs: TModel;

    public isLoaded: boolean;

    protected constructor(attrs: TModel = null, isLoaded = false) {
        this.attrs = attrs;
        this.isLoaded = isLoaded;
    }

    /**
     * Функция получения значения по ключу из объека модели
     * @param {string} key - поле, значение которого нужно получить
     * @returns {*}
     */
    get(key: string): any {
        const spl = key.split('.');

        const tempAttr: TModel = this.attrs;
        let result: any;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < spl.length; i++) {
            const tempKey = spl[i] as keyof TModel;
            result = tempAttr[tempKey];

            if (result === undefined || result === null) {
                return null;
            }
        }
        return result;
    }

    /**
     * Функция изменения полей в объекте модели
     * @param {object} attrs - объект, в котором храняться данные пользователя
     */
    update(attrs: TModel): void {
        this.attrs = Object.assign(this.attrs, attrs);
    }
}

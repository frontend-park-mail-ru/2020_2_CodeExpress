import { View } from 'managers/base-view/base-view';
import { IProps, IState } from 'store/interfaces';
import { Page } from 'components/page/page';

import RadioTemplate from './radio-view.hbs';
import './radio-view.scss';

import RadioPlaceholder from '../../assets/default/radioPlaceholder.svg';

export class RadioView extends View<IProps, IState> {
    private page: Page;

    constructor(props: IProps, storage: any) {
        super(props, storage);
        this.page = new Page(this.props, this.storage);
    }

    render(): void {
        this.page.show();
        this.props.parent = document.querySelector('.page__content');

        this.props.parent.insertAdjacentHTML('afterbegin', RadioTemplate({
            placeholder: RadioPlaceholder,
        }));
    }
}

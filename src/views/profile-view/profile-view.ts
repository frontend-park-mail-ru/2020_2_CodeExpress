import { IProps, IState, IStorage } from 'store/interfaces';
import { View } from 'managers/base-view/base-view';
import { Page } from 'components/page/page';
import { RouterStore } from 'store/routes';
import { router } from 'managers/router/router';
import { ModelUser } from 'models/user';
import { ModelPlayList } from 'models/playlist';

import Placeholder from 'assets/default/radioPlaceholder.svg';
import DefaultAvatar from 'assets/default/user-default.svg';

import PlaylistItemTemplate from 'views/playlists-view/playlist.hbs';
import ProfileTemplate from './profile-view.hbs';

import './profile-view.scss';

export class ProfileView extends View<IProps, IState> {
    private page: Page;

    private isLoaded: boolean;

    constructor(props: IProps, storage: IStorage<IState>) {
        super(props, storage);

        this.page = new Page(this.props, this.storage);
        this.isLoaded = false;
    }

    didMount(): void {
        const info = ModelUser.getProfileWithPlaylists(this.props.arg).then((data: any) => {
            const { user, playlists } = data;
            this.setState({ user, playlists });
        }).catch(() => {
            router.go(RouterStore.website.index);
        });

        const subs = ModelUser.getSubs(this.props.arg).then((res) => {
            const [subscribers, subscriptions] = res;

            this.setState({ subscribers, subscriptions });
        });

        Promise.all([info, subs]).then(() => {
            this.isLoaded = true;
            this.props.parent.innerHTML = '';
            this.render();
        });
    }

    showContent = (event: Event) => {
        const target: HTMLElement = event.target as HTMLElement;
        const activeToggle = this.props.parent.querySelector('.profile-page__toggle-item_active');
        const activeContent = this.props.parent.querySelector('.profile-page__item_active');

        activeToggle.classList.remove('profile-page__toggle-item_active');
        activeContent.classList.remove('profile-page__item_active');

        target.classList.add('profile-page__toggle-item_active');
        this.props.parent.querySelector(`.${target.dataset.class}`).classList.add('profile-page__item_active');
    };

    follow = (event: Event) => {
        const target: HTMLElement = event.target as HTMLElement;

        if (target.dataset.follow === 'false') {
            ModelUser.follow(target.dataset.username).then(() => {
                target.innerText = 'Отписаться';
                target.dataset.follow = 'true';
            });
        } else {
            ModelUser.unFollow(target.dataset.username).then(() => {
                target.innerText = 'Подписаться';
                target.dataset.follow = 'false';
            });
        }
    };

    render() {
        const user: ModelUser = this.storage.get('user');
        const profile: ModelUser = this.isLoaded ? this.state.user : null;
        const subscribers: ModelUser[] | [] = this.isLoaded ? this.state.subscribers : [];
        const subscriptions: ModelUser[] | [] = this.isLoaded ? this.state.subscriptions : [];
        const playlists = this.isLoaded ? this.state.playlists : null;
        const isEmpty = playlists ? !playlists.length : true;
        const playlistTemp = PlaylistItemTemplate({ playlists });
        let follow = false;

        if (user.attrs && profile) {
            follow = user.attrs.username !== profile.attrs.username;
        }

        this.page.show();
        this.props.parent = document.querySelector('.page__content');
        this.props.parent.insertAdjacentHTML('afterbegin', ProfileTemplate({
            isEmpty,
            playlistTemp,
            follow,
            profile,
            subscribers,
            subscriptions,
            subscribersLength: subscribers.length,
            subscriptionsLength: subscriptions.length,
            default: DefaultAvatar,
            placeholder: Placeholder,
        }));

        const toggleButtons = this.props.parent.querySelectorAll('.profile-page__toggle-item');

        toggleButtons.forEach((item) => {
            item.addEventListener('click', this.showContent);
        });

        if (follow) {
            const followButton = this.props.parent.querySelector('.profile-page__follow');

            followButton.addEventListener('click', this.follow);
        }
    }
}

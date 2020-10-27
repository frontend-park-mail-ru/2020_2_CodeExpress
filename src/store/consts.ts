import { ITrack } from 'components/track-list/track-list';

export const statuses = {
    statusOff: 'off',
    statusOn: 'on',
    iconPause: 'fa-pause',
    iconPlay: 'fa-play',
};

export const albumArray = [
    {
        img: '../../assets/backgrounds/imagine_dragons_elove.jpg',
        title: 'Elove',
        group: 'Imagine Dragons',
    },
    {
        img: '../../assets/backgrounds/pillars_of_wisdom_ghost.jpeg',
        title: 'Pillars of Wisdom',
        group: 'Ghost',
    },
    {
        img: '../../assets/backgrounds/deafbrick_deafkids_petbrick.jpg',
        title: 'Deafbrick',
        group: 'Deafkids, Petbrick',
    },
    {
        img: '../../assets/backgrounds/castaways_monster_rally.jpg',
        title: 'Castaways, Vol. 1',
        group: 'Monster Rally',
    },
    {
        img: '../../assets/backgrounds/native_onerepublic.jpg',
        title: 'Native',
        group: 'OneRepublic',
    },
    {
        img: '../../assets/backgrounds/hot_space_queen.jpg',
        title: 'Hot Space',
        group: 'Queen',
    },
];

export const slidesTemp = [
    {
        img: '../assets/backgrounds/topic-calm.jpg',
        title: 'Спокойное',
    },
    {
        img: '../assets/backgrounds/topic-rock.jpg',
        title: 'Рок',
    },
    {
        img: '../assets/backgrounds/topic-calm.jpg',
        title: 'Спокойное',
    },
    {
        img: '../assets/backgrounds/topic-sport.jpg',
        title: 'Спорт',
    },
];

export const tracksList: ITrack[] = [
    {
        index: 1,
        audio: '../assets/mp3/nirvana-smells.mp3',
        title: 'Smells Like Teen Spirit',
        album: '../assets/backgrounds/nirvana-nevermind-album.jpg',
        group: 'Nirvana',
        duration: '5:20',
    },
    {
        index: 2,
        audio: '../assets/mp3/nirvana-man.mp3',
        title: 'The Man Who Sold the World',
        album: '../assets/backgrounds/nirvana-nevermind-album.jpg',
        group: 'Nirvana',
        duration: '5:20',
    },
    {
        index: 3,
        audio: '../assets/mp3/apocalyptica-path.mp3',
        title: 'Path',
        album: '../assets/backgrounds/apocalyptica-cult-album.jpeg',
        group: 'Apocalyptica',
        duration: '5:20',
    },
    {
        index: 4,
        audio: '../assets/mp3/apocalyptica-fade.mp3',
        title: 'Fade in',
        album: '../assets/backgrounds/apocalyptica-metalica-cover-album.jpg',
        group: 'Apocalyptica',
        duration: '5:20',
    },
    {
        index: 5,
        audio: '../assets/mp3/Apocalyptica-One.mp3',
        title: 'One',
        album: '../assets/backgrounds/apocalyptica-inquisition-symphony-album.jpg',
        group: 'Apocalyptica',
        duration: '5:20',
    },
];

import React from 'react';

import {mount, configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk';

import ConnectedMovieDetails, { MovieDetails, mapDispatchToProps } from './MovieDetails';
import * as actionCreators from '../../store/actions/index';
import * as actionTypes from '../../store/actions/actionTypes';
import { movieItems } from '../../__mocks__/movieItems';


configure({
    adapter: new Adapter()
});

describe('<MovieDetails/>', () => {
    const initialState = {
        details: {
            movieDetailsItems: [],
            chosenMovieItem: movieItems[0]
        }
    };
    const mockStore = configureStore([thunk]);
    let store, wrapper;
    const onSearch = jest.fn();

    beforeEach(() => {
        store = mockStore(initialState);
        wrapper = mount(<ConnectedMovieDetails store={store}/>);
    });

    it('render the connected component', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('check Prop matches with initialState', () => {
        expect(wrapper.find(MovieDetails).prop('movieItems')).toEqual(initialState.details.movieDetailsItems);
        expect(wrapper.find(MovieDetails).prop('chosenMovieItem')).toEqual(initialState.details.chosenMovieItem);
    });

    it('check CHOOSE_MOVIE_DETAILS on dispatching', () => {
        let action;
        store.dispatch(actionCreators.chooseMovieDetails(111));
        action = store.getActions();
        expect(action[0].type).toBe(actionTypes.CHOOSE_MOVIE_DETAILS);
    });

    it('capturing Snapshot of MovieDetails', () => {
        const testFunction = () => true;
        const renderedValue =  renderer.create(<MovieDetails
            movieItems={initialState.details.movieDetailsItems}
            chosenMovieItem={initialState.details.chosenMovieItem}
            onMovieChosen={testFunction}/>).toJSON();
        expect(renderedValue).toMatchSnapshot();
    });

    it('check GET_MOVIES_DETAILS on dispatching', async () => {
        window.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({ data: [] })}));
        await store.dispatch(actionCreators.searchMovieDetails('test'))
        const action = store.getActions();
        expect(action[0].type).toBe(actionTypes.GET_MOVIES_DETAILS);
    });

    it('test mapDispatchToProps', () => {
        const dispatch = jest.fn();
        mapDispatchToProps(dispatch).onMovieChosen(111);
        expect(dispatch.mock.calls[0][0]).toEqual({type: actionTypes.CHOOSE_MOVIE_DETAILS, payload:{'id': 111}});

        mapDispatchToProps(dispatch).onMovieSearched('test');
        expect(dispatch.mock.calls[1][0]).toBeDefined();
    });

    it('componentDidUpdate dispatch GET_MOVIES_DETAILS action', () => {
        const testFunction = () => true;
        const onMovieSearchedSpy = jest.fn();
        const onMovieSearched = onMovieSearchedSpy;
        wrapper = shallow(<MovieDetails
            onMovieSearched={onMovieSearchedSpy}
            chosenMovieItem={movieItems[0]}
            onMovieChosen={testFunction}/>);

        let prevProp = {chosenMovieItem: movieItems[0]};
        wrapper.instance().componentDidUpdate(prevProp);
        expect(onMovieSearchedSpy).not.toHaveBeenCalled();

        prevProp = {chosenMovieItem: movieItems[1]};
        wrapper.instance().componentDidUpdate(prevProp);
        expect(onMovieSearchedSpy).toHaveBeenCalled();
    });
});
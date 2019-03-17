import axios from 'axios';

import { MOVIE_API } from 'constants';

const searchMovie = (name = 'star') => {
	return axios.get(
		MOVIE_API.host,
		{
			params: { apikey: MOVIE_API.apiKey, s: name }
		}
	);
};


const getMovie = (imdbID) => {
	// TODO: implement api call
};

export default {
	searchMovie,
};
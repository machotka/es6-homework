import Button from 'components/Button';

import MoviesService from 'services/movies';

const MoviesScreen = () => {
	// TODO: add input for search

	var rootNode = document.createElement('div');
	rootNode.appendChild(
		Button({
			label: 'Search',
			onClick: () => {
				MoviesService.searchMovie().then(
					(response) => {
						console.log('response', response);
					},
					(err) => {
						console.error(err);
					},
				);
			},
		})
	);


	return rootNode;
};

export default MoviesScreen;
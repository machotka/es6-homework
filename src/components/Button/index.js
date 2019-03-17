const Button = ({ label, onClick }) => {
	const button = document.createElement('button');
	button.addEventListener('click', onClick);
	button.innerHTML = label;

	return button;
};

export default Button;
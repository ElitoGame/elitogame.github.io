const BackButton = () => {
	// get the current url and remove everything but after the last /
	const urls = window.location.href.split("/");
	urls.pop();
	const url = urls.pop();
	return (
		<a class='px-4 md:px-8' href={"/#" + url}>
			&lt; Back
		</a>
	);
};

export default BackButton;

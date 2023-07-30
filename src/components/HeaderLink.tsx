const HeaderLink = (props: { href: string; children: any }) => {
	return (
		<button
			onClick={() => {
				document
					.querySelector(props.href)
					?.scrollIntoView({ behavior: "smooth" });
			}}
			class='text-2xl'
		>
			{props.children}
		</button>
	);
};

export default HeaderLink;

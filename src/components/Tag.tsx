import { createSignal } from "solid-js";

const Tag = (props: { label: string }) => {
	const [isExpanded, setIsExpanded] = createSignal(false);

	return (
		<figure
			class='flex flex-row items-center gap-1 cursor-pointer'
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			<img
				width={24}
				height={24}
				src={"/images/tags/" + props.label + ".svg"}
				alt={props.label}
				class='fill-accent dark:fill-accent_dark'
			/>
			<p
				style={{
					transition: "max-width 300ms ease-in-out",
					width: "auto",
					"max-width": isExpanded() ? "120px" : "0",
				}}
				class='h-max line-clamp-1 overflow-hidden'
			>
				{props.label}
			</p>
		</figure>
	);
};

export default Tag;

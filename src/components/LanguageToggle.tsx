import { Show, createSignal } from "solid-js";

const ThemeToggle = () => {
	const [isEN, setIsEN] = createSignal(localStorage.getItem("locale") === "en");

	return (
		<button
			aria-label='locale toggle'
			onClick={() => {
				// document.documentElement.classList.toggle("dark");
				localStorage.setItem("locale", isEN() ? "de" : "en");
				setIsEN(!isEN());
			}}
		>
			<Show when={isEN()} fallback={<button class='text-2xl'>DE</button>}>
				<button class='text-2xl'>EN</button>
			</Show>
		</button>
	);
};

export default ThemeToggle;

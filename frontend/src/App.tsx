import { default as Router } from "./routes";
import "./App.css";

export const categories = [
	"Action ",
	"Adventure ",
	"Comedy ",
	"Documentary ",
	"Drama ",
	"Horror ",
	"Mystery ",
	"Romance ",
	"Thriller ",
];

export const ratings = [
	"g ",
	"pg ",
	"pg-13 ",
	"rs ",
	"x ",
];

function App() {
	return (
		<>
			<Router />
		</>
	);
}

export default App;

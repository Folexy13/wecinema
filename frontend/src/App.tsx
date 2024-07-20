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
export const themes = [
	"Coming-of-age story", 
	"Good versus evil",
	"Love", 
    "Redemption",
	"Family",
	"Death", 
	"Opperession",
	 "Survival", 
	 "Revenge", 
	"Justice",
	"War", 
	"Bravery", 
    "Freedom", 
	"Friendship",
	"Death",
	"Isolation",
    "Peace", 
	"Perseverance", 
];
export const ratings = [
	"g ",
	"pg ",
	"pg-13 ",
	"r ",
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

import React from "react";
import {Root, Indicator} from "@radix-ui/react-progress";

type Props = {
    value: number
    max: number
}

function ProgressDemo (props: Props) {
	const [progress, setProgress] = React.useState(13);

	// React.useEffect(() => {
	// 	const timer = setTimeout(() => setProgress(66), 500);
	// 	return () => clearTimeout(timer);
	// }, []);

	return (
		<Root
			className="relative h-[25px] w-100% grow overflow-hidden rounded-full bg-white border-black border-2"
			style={{
				// Fix overflow clipping in Safari
				// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
				transform: "translateZ(0)",
			}}
			value={progress}
		>
			<Indicator
				className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-black transition-transform duration-[660ms]"
				style={{ transform: `translateX(-${100 - (props.value/props.max * 100)}%)` }}
			/>
		</Root>
	);
};

export default ProgressDemo;

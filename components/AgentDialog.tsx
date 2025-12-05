'use client'
import { Typewriter } from 'react-simple-typewriter'

export interface Props {
	words: string[];
	action?: ()=>void | null
}

export function AgentDialog({words, action}: Props) {
	//todo: (low priority) onLoopDone doesnt work. might be a library issue idk
	return (
		<Typewriter
			words={words}
			cursor={false}
			deleteSpeed={0}
			typeSpeed={20}
			delaySpeed={2500}
			loop={1}
			onLoopDone={action}
		/>
	);
}
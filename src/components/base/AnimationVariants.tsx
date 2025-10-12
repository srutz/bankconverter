import { Variants } from 'framer-motion';


export function wobble(delay: number = 0) {
    const v: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.5,
            y: 50,
            rotate: -10
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            transition: {
                delay: delay,
                type: "spring",
                damping: 8,  // high less wobnly
                stiffness: 100, // lower less wobbly
                duration: 0.8
            }
        }
    }
    return v
}

export function fadeIn(delay: number = 0) {
    const v: Variants = {
        hidden: {
            opacity: 0,
            scale: 1,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delay: delay,
                ease: "easeOut",
            }
        }
    }
    return v
}

export function fadeInMove(delay: number = 0) {
    const v: Variants = {
        hidden: {
            opacity: 0,
            scale: 1,
            y: -500,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                delay: delay,
                ease: "easeOut",
            }
        }
    }
    return v
}

export function fadeInFromLeft(delay: number = 0) {
    const v: Variants = {
        hidden: {
            opacity: 0,
            scale: 1,
            x: -500,
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
                delay: delay,
                ease: "easeOut",
            }
        }
    }
    return v
}

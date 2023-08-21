const name = "Ms.Random";
const name2 = "Ms.Random2";
const name3 = "Ms.Random3";

export default name;
export {name2,name3};


export const love = () => {
    return `${~~(Math.random() * 100)}%`; // ~~ used for Math.floor
}

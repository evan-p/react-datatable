const randomInt = () => {
    return Math.round(Math.random()*10000);
}

const randomEntry = columns => {
    const res = {};
    columns.forEach(o => {
       res[o.name] = randomInt(); 
    });
    return res;
}

export default randomEntry;
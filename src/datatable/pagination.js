function pagination(page, lastPage) {
    const res = [];
    if(lastPage<=9){
        for(let i=1; i<=lastPage; i++){
            res.push(i)
        }
        return res
    }
    res.push(page)
    const remFront = 5 - page > 0 ? 5 - page : 0
    const remBack = (page + 4 - lastPage) > 0 ? (page + 4 - lastPage) : 0;
    const fullFront = page <= 5 + remBack;
    const fullBack = (lastPage + remFront - page) < 5;
    if(fullFront){
        for(let i = page-1; i>=1; i--){
            res.unshift(i)
        }
    }else{
        for(let i = 1; i<=2+remBack; i++) res.unshift(page-i)
        res.unshift('...')
        res.unshift(1)
    }
    if(fullBack){
        for(let i = page+1; i<=lastPage; i++){
            res.push(i)
        }
    }else{
        for(let i = 1; i<=2+remFront; i++) res.push(page+i)
        res.push('...')
        res.push(lastPage)
    }
    return res
}

export default pagination
function paginatie(model) {
    return (req, res, next) => {
        const nowPage = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIdx =(nowPage -1) * limit;
        const endIdx = page * limit;

        const result = {};
        if (endIdx < model.length) {
            result.next ={
                page : page +1,
                limit : limit
            };
        }
        if (startIdx > 0) {
            result.previous = {
                page : page -1,
                limit : limit,
            };
        }
        result.result = model.slice(startIdx, endIdx);
        res.paginatiedResult = result;
        next();
    }
}